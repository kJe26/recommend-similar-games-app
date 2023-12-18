import { Page, Button, Card, DataTable } from "@shopify/polaris";

export default async function Index() {
  const rows = [
    ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
    ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
    [
      'Navy Merino Wool Blazer with khaki chinos and yellow belt',
      '$445.00',
      124518,
      32,
      '$14,240.00',
    ],
  ];

  const games = [];
  const token = "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";
  const headers = {
    "X-Shopify-Access-Token": token,
    "Accept": "application/json",
    "Content-Type": "application/graphql",
  };

  const url = 'https://corsproxy.io/?https://kubuk-test.myshopify.com/admin/api/2023-10/graphql.json';
  const after = null;
  const body = `{
      products(first:10, after:${after}) {
          nodes {
              metafields(first:20) {
                  nodes {
                      key,
                      value
                  }
              }
          }
          pageInfo {
              hasNextPage,
              endCursor
          }
      }
  }`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  let data = await response.json();
  
  while (data.data.products.pageInfo.hasNextPage) {
    const after: unknown = data.data.products.pageInfo.endCursor;
    const body = `{
      products(first:10, after:${after}) {
          nodes {
              metafields(first:20) {
                  nodes {
                      key,
                      value
                  }
              }
          }
          pageInfo {
              hasNextPage,
              endCursor
          }
      }
    }`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });
    data = await response.json();
    games.push(...data.data.products.nodes);
  }

  console.log(games);

  return <></>;
}
