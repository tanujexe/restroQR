/**
 * Helper to build complete URL with table query parameter
 */
export function buildTableUrl(baseUrl, paramName = 'table', tableIdentifier = '1') {
  if (!baseUrl || !baseUrl.trim()) {
    return `https://menu.example.com?${paramName}=${encodeURIComponent(tableIdentifier)}`;
  }
  let cleanUrl = baseUrl.trim();
  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = `https://${cleanUrl}`;
  }

  try {
    const urlObj = new URL(cleanUrl);
    urlObj.searchParams.set(paramName, tableIdentifier);
    return urlObj.toString();
  } catch {
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}${encodeURIComponent(paramName)}=${encodeURIComponent(tableIdentifier)}`;
  }
}

/**
 * Download SVG element as PNG
 */
export function downloadCardAsPng(cardElementId, fileName = 'table-qr.png') {
  const cardElement = document.getElementById(cardElementId);
  if (!cardElement) return;

  const svg = cardElement.querySelector('svg');
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  // Create image from SVG data
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Render at high resolution (3x) for crisp printing
    const scale = 3;
    canvas.width = (svg.clientWidth || 200) * scale;
    canvas.height = (svg.clientHeight || 200) * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

/**
 * Download raw SVG string
 */
export function downloadCardAsSvg(cardElementId, fileName = 'table-qr.svg') {
  const cardElement = document.getElementById(cardElementId);
  if (!cardElement) return;

  const svg = cardElement.querySelector('svg');
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

