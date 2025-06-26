import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // ✅ .env 読み込み

const CSV_FILE_PATH = path.join(__dirname, '../キャスト登録.csv');
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ STRAPI_ADMIN_TOKEN が .env に設定されていません');
  process.exit(1);
}

// CSV読み込み
const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

(async () => {
  for (const record of records) {
    const postData = {
      data: {
        name: record.name,
        age: Number(record.age),
        catchCopy: record.catchCopy,
        height: Number(record.height),
        weight: Number(record.weight),
        isNew: record.isNew?.toLowerCase() === 'true',
        MBTI: record.MBTI || null,
        sexinessLevel: Number(record.sexinessLevel),
        bloodtype: record.bloodtype || null,
        SNSURL: record.SNSURL || null,
        customID: record.customID,
        stillwork: record.stillwork?.toLowerCase() === 'true',
        QA: record.QA || null,
        Managercomment: record.Managercomment || null,
        Featureintroduction: record.Featureintroduction || null,
        isReception: record.isReception?.toLowerCase() === 'true',
        slug: record.slug || record.customID?.toLowerCase() || undefined,
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
      console.error(err.response?.data || err.message);
    }
  }
})();
