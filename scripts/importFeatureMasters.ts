// scripts/importFeatureMasters.ts
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fetch } from 'undici';
import 'dotenv/config';

const API_URL = 'http://localhost:1337/api/feature-masters';
const AUTH_TOKEN = process.env.STRAPI_ADMIN_TOKEN;
 // StrapiのURLに合わせて変更
const csvFilePath = path.resolve(__dirname, './feature-masters.csv');

const importData = async () => {
  const results: any[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        const body = {
          data: {
            name: row.name,
            category: row.category,
            label_en: row.label_en,
            type: row.type,
            is_active: true,
          }
        };

        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${AUTH_TOKEN}`,
                },
            body: JSON.stringify(body),
          });

          const resJson = await res.json();
          console.log('✅ 登録成功:', resJson);
        } catch (err) {
          console.error('❌ エラー:', err);
        }
      }
    });
};

importData();
