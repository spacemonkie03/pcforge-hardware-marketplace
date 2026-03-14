import { access, mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const root = process.cwd();
const publicRoot = path.join(root, 'frontend', 'public');
const docsRoot = path.join(root, 'docs');

const assets = [
  {
    category: 'gpu',
    intendedUse: 'category-cover',
    localPath: 'images/categories/gpu.jpg',
    title: 'File:2023 MSI GeForce RTX 2080 Gaming X Trio (3).jpg',
  },
  {
    category: 'gpu',
    intendedUse: 'component-fallback',
    localPath: 'images/components/gpu/gpu-alt-01.jpg',
    title: 'File:Sapphire-Radeon-HD-5570-Video-Card.jpg',
  },
  {
    category: 'cpu',
    intendedUse: 'category-cover',
    localPath: 'images/categories/cpu.jpg',
    title: 'File:2023 Intel Core i7 12700KF (3).jpg',
  },
  {
    category: 'cpu',
    intendedUse: 'component-fallback',
    localPath: 'images/components/cpu/cpu-alt-01.jpg',
    title: 'File:AMD A10-4600M (AM4600DEC44HJ) APU-top PNr°0811.jpg',
  },
  {
    category: 'motherboard',
    intendedUse: 'category-cover',
    localPath: 'images/categories/motherboard.jpg',
    title: 'File:2023 Płyta główna Asus ROG STRIX Z690-A GAMING WIFI.jpg',
  },
  {
    category: 'motherboard',
    intendedUse: 'component-fallback',
    localPath: 'images/components/motherboard/motherboard-alt-01.jpg',
    title: 'File:2023 Płyta główna ASRock A320M-DVS.jpg',
  },
  {
    category: 'ram',
    intendedUse: 'category-cover',
    localPath: 'images/categories/ram.png',
    title: 'File:16 GiB-DDR4-RAM-Riegel RAM019FIX Small Crop 90 PCNT.png',
  },
  {
    category: 'ram',
    intendedUse: 'component-fallback',
    localPath: 'images/components/ram/ram-alt-01.jpg',
    title: 'File:RAM Module (SDRAM-DDR4).jpg',
  },
  {
    category: 'storage',
    intendedUse: 'category-cover',
    localPath: 'images/categories/storage.jpg',
    title: 'File:Samsung 980 PRO PCIe 4.0 NVMe SSD 1TB-top PNr°0915.jpg',
  },
  {
    category: 'storage',
    intendedUse: 'component-fallback',
    localPath: 'images/components/storage/storage-alt-01.png',
    title: 'File:Samsung 870 QVO 8TB SATA 2,5 Zoll Internes Solid State Drive (SSD) (MZ-77Q8T0BW) 20211008 SSD023 corr.png',
  },
  {
    category: 'psu',
    intendedUse: 'category-cover',
    localPath: 'images/categories/psu.jpg',
    title: 'File:Full modular ATX power supply unit.jpg',
  },
  {
    category: 'psu',
    intendedUse: 'component-fallback',
    localPath: 'images/components/psu/psu-alt-01.jpg',
    title: 'File:ATX Computer power supply unit.jpg',
  },
  {
    category: 'case',
    intendedUse: 'category-cover',
    localPath: 'images/categories/case.jpg',
    title: 'File:Hyte Y70 computer case Computex 2025.jpg',
  },
  {
    category: 'case',
    intendedUse: 'component-fallback',
    localPath: 'images/components/case/case-alt-01.jpg',
    title: 'File:ATX computer case - left - 2018-05-18.jpg',
  },
  {
    category: 'cooler',
    intendedUse: 'category-cover',
    localPath: 'images/categories/cooler.jpg',
    title: 'File:2023 Chłodzenie procesora be quiet! Dark Rock Top Flow (1).jpg',
  },
  {
    category: 'cooler',
    intendedUse: 'component-fallback',
    localPath: 'images/components/cooler/cooler-alt-01.jpg',
    title: 'File:Corsair H100i 240mm CPU cooler. On MSI Z590 Torpedo motherboard. (51987363353).jpg',
  },
];

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, attempts = 5) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'PCForgeImageFetcher/1.0 (local project asset sync)',
        },
      });
      return response;
    } catch (error) {
      lastError = error;
      await sleep(1500 * attempt);
    }
  }

  throw lastError;
};

const fetchCommonsMetadata = async (title) => {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&titles=' +
    encodeURIComponent(title) +
    '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1200&format=json&origin=*';

  const response = await fetchWithRetry(url);
  if (!response.ok) {
    throw new Error(`Failed metadata request for ${title}: ${response.status}`);
  }

  const data = await response.json();
  const page = Object.values(data.query.pages)[0];
  const info = page?.imageinfo?.[0];

  if (!info?.thumburl) {
    throw new Error(`No image metadata available for ${title}`);
  }

  return {
    pageTitle: page.title,
    sourcePageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    downloadUrl: info.thumburl,
    width: info.thumbwidth || info.width,
    height: info.thumbheight || info.height,
    originalWidth: info.width,
    originalHeight: info.height,
    license: stripHtml(info.extmetadata?.LicenseShortName?.value),
    licenseUrl: stripHtml(info.extmetadata?.LicenseUrl?.value),
    title: stripHtml(info.extmetadata?.ObjectName?.value) || page.title.replace(/^File:/, ''),
    attribution: stripHtml(info.extmetadata?.Artist?.value) || stripHtml(info.extmetadata?.Credit?.value),
  };
};

const downloadFile = async (url, destination) => {
  let lastStatus = 0;

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetchWithRetry(url);

    lastStatus = response.status;

    if (response.ok && response.body) {
      await mkdir(path.dirname(destination), { recursive: true });
      await pipeline(response.body, createWriteStream(destination));
      return;
    }

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Failed to download ${url}: ${response.status}`);
    }

    await sleep(2500 * attempt);
  }

  throw new Error(`Failed to download ${url}: ${lastStatus}`);
};

const fileExists = async (targetPath) => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const main = async () => {
  const manifest = [];

  for (const asset of assets) {
    const metadata = await fetchCommonsMetadata(asset.title);
    const outputPath = path.join(publicRoot, asset.localPath);

    if (!(await fileExists(outputPath))) {
      await downloadFile(metadata.downloadUrl, outputPath);
      await sleep(1800);
    }

    manifest.push({
      localPath: `/` + asset.localPath.replace(/\\/g, '/'),
      filesystemPath: outputPath,
      originalSourceUrl: metadata.sourcePageUrl,
      originalDownloadUrl: metadata.downloadUrl,
      license: metadata.license,
      licenseUrl: metadata.licenseUrl,
      title: metadata.title,
      attribution: metadata.attribution,
      width: metadata.width,
      height: metadata.height,
      originalWidth: metadata.originalWidth,
      originalHeight: metadata.originalHeight,
      intendedCategory: asset.category,
      intendedUse: asset.intendedUse,
      sourcePlatform: 'Wikimedia Commons',
    });
  }

  await mkdir(docsRoot, { recursive: true });
  await writeFile(
    path.join(docsRoot, 'image-assets-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8',
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
