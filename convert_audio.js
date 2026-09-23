const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const src = 'cielo-eterno.mp4';
const dst = 'cielo-eterno.mp3';
const args = ['-i', src, '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', dst];

console.log('ffmpeg path:', ffmpeg);
const result = spawnSync(ffmpeg, args, { stdio: 'inherit' });
console.log('exit code:', result.status);
