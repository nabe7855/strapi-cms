import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CSV_FILE_PATH = path.join(__dirname, '../モモモ登録.csv');
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ STRAPI_ADMIN_TOKEN が .env に設定されていません');
  process.exit(1);
}

const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

function toBoolean(value: string | undefined): boolean {
  return value?.toLowerCase() === 'true';
}

function cleanJSONString(input: string): string {
  return input
    .replace(/""/g, '"') // CSV由来の二重クオートを正規化
    .replace(/[\u0000-\u001F\u007F]/g, (c) => {
      if (c === '\n') return '\\n'; // 改行→エスケープ
      if (c === '\r') return '';    // CR除去
      return '';                    // 他の制御文字も除去
    });
}

(async () => {
  for (const record of records) {
    // therapist_qas の整形処理
    let therapist_qas = [];
    try {
      const cleaned = cleanJSONString(record.therapist_qas);
      const parsed = JSON.parse(cleaned);

      therapist_qas = Array.isArray(parsed)
        ? parsed.map((item: any) => ({
            label_ja: item.label_ja || '',
            label_en: item.label_en || '',
            type_value: item.type_value || '',
            type_label: item.type_label || '',
            answer_text: item.answer_text || '',
            sort_order: Number(item.sort_order) || 0,
            is_active: toBoolean(item.is_active),
          }))
        : [];
    } catch (err: any) {
      console.warn(`⚠️ therapist_qas JSON 解析失敗: ${record.name}`, err.message);
    }

    const postData = {
      data: {
        name: record.name,
        age: Number(record.age),
        catchCopy: record.catchCopy,
        height: Number(record.height),
        weight: Number(record.weight),
        isNew: toBoolean(record.isNew),
        MBTI: record.MBTI || null,
        sexinessLevel: Number(record.sexinessLevel) || null,
        bloodtype: record.bloodtype || null,
        SNSURL: record.SNSURL || null,
        customID: record.customID,
        stillwork: toBoolean(record.stillwork),
        isReception: toBoolean(record.isReception),
        slug: record.slug || record.customID?.toLowerCase() || undefined,
        therapist_qas,
      },
    };

    try {
      const res = await axios.post(`${STRAPI_URL}/api/casts`, postData, {
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
      });

      console.log(`✅ 登録成功: ${record.name} (ID: ${res.data.data.id})`);
    } catch (err: any) {
      console.error(`❌ 登録失敗: ${record.name}`);

      if (err.response?.data?.error?.details?.errors) {
        console.error('🔍 エラーディテール:');
        console.error(JSON.stringify(err.response.data.error.details.errors, null, 2));
      } else {
        console.error(err.response?.data || err.message);
      }
    }
  }
})();
