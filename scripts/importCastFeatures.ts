import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:1337';
const csvFilePath = path.resolve(__dirname, './cast_features_test.csv');
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error('❌ STRAPI_ADMIN_TOKEN is not defined in .env');
  process.exit(1);
}

interface CsvRow {
  cast_custom_id: string;
  feature_label_en: string;
  value_text?: string;
  value_number?: string;
  value_boolean?: string;
}

// ID取得用の関数（cast, feature）
const fetchEntityId = async (endpoint: string, key: string, value: string): Promise<number | null> => {
  const res = await fetch(`${API_URL}/api/${endpoint}?filters[${key}][$eq]=${encodeURIComponent(value)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  const json = await res.json() as { data: any[] };

  if (!json || !json.data || !Array.isArray(json.data) || json.data.length === 0) {
    console.error(`❌ ${endpoint} のIDが見つかりません: ${value}`);
    return null;
  }

  const foundId = json.data[0]?.id;
  console.log(`🔍 ${endpoint} の ${key}='${value}' → ID: ${foundId}`);
  return foundId ?? null;
};

// データインポート処理
const importData = async () => {
  const results: CsvRow[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data: CsvRow) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        try {
          console.log(`\n--- 処理開始 ---`);
          console.log(`🧩 cast_custom_id: ${row.cast_custom_id}, feature_label_en: ${row.feature_label_en}`);

          const castId = await fetchEntityId('casts', 'customID', row.cast_custom_id);
          const featureId = await fetchEntityId('feature-masters', 'label_en', row.feature_label_en);

          if (!castId || !featureId) {
            console.error(`❌ ID取得失敗: cast='${row.cast_custom_id}' / feature='${row.feature_label_en}'`);
            continue;
          }

          const body = {
            data: {
              cast: castId,
              feature_master: featureId,
              value_text: row.value_text?.trim() || null,
              value_number: row.value_number ? Number(row.value_number) : null,
              value_boolean:
                typeof row.value_boolean === 'string'
                  ? row.value_boolean.trim().toLowerCase() === 'true'
                    ? true
                    : row.value_boolean.trim().toLowerCase() === 'false'
                    ? false
                    : null
                  : null,
            },
          };

          console.log(`📦 POST body:`, JSON.stringify(body, null, 2));

          const res = await fetch(`${API_URL}/api/cast-features`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(body),
          });

          const responseJson = (await res.json()) as { data?: { id?: number } };

          if (!res.ok) {
            console.error(`❌ POST失敗: ${row.cast_custom_id} x ${row.feature_label_en}`);
            console.error(responseJson);
          } else {
            console.log(`✅ 登録成功: ${row.cast_custom_id} x ${row.feature_label_en}`);
            console.log(`📄 登録結果 ID: ${responseJson.data?.id}`);
          }

        } catch (err) {
          console.error(`❌ 例外発生: ${row.cast_custom_id} x ${row.feature_label_en}`, err);
        }
      }
    });
};

importData();
