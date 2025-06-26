import 'dotenv/config';
import fetch from 'node-fetch';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_ADMIN_TOKEN || '';

const targetCustomID = 'エゴマ';

const updateData = {
  name: '新しい名前',
};

async function testToken() {
  console.log('🔑 トークンを使って /api/casts にアクセスできるか検証中...');

  const res = await fetch(`${STRAPI_URL}/api/casts`, {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    console.error('❌ トークン認証エラーの可能性があります');
    return false;
  }

  const json = await res.json();
  console.log('📦 レスポンス:', JSON.stringify(json, null, 2));
  console.log('✅ トークンOK。APIアクセス成功');
  return true;
}

async function main() {
  try {
    console.log(`🔍 customID="${targetCustomID}" のキャストを検索中...`);

    // 1. customIDで該当キャストを検索
    const searchRes = await fetch(
      `${STRAPI_URL}/api/casts?filters[customID][$eq]=${encodeURIComponent(targetCustomID)}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      }
    );

    const searchJson: any = await searchRes.json();
    console.log('🔎 searchJson:', JSON.stringify(searchJson, null, 2));

    const found = searchJson.data?.[0];
    if (!found) {
      console.error('❌ 該当するキャストが見つかりません');
      return;
    }

    const castID = found.id;
    console.log(`✅ 見つかったID: ${castID}`);

    // ✅ 通常APIエンドポイントで更新
    const putRes = await fetch(`${STRAPI_URL}/api/casts/${castID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: updateData }),
    });

    const putJson: any = await putRes.json();

    if (putRes.ok) {
      console.log(`🟢 更新成功: ID=${putJson.data?.id}`);
    } else {
      console.error('❌ 更新失敗:', JSON.stringify(putJson, null, 2));
    }
  } catch (err) {
    console.error('🔥 予期せぬエラー:', err);
  }
}

// ✅ トークンチェックしてから main 実行
testToken().then((ok) => {
  if (ok) main();
});
