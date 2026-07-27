const { execFileSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');

try {
    execFileSync(ffmpegPath, [
        '-y',
        '-i', 'real_test.mp4',
        '-vcodec', 'libwebp',
        '-vf', 'scale=\'min(512,iw)\':min\'(512,ih)\':force_original_aspect_ratio=decrease,fps=12,pad=512:512:-1:-1:color=white@0.0,format=rgba',
        '-lossless', '0',
        '-compression_level', '6',
        '-q:v', '50',
        '-loop', '0',
        '-preset', 'picture',
        '-an',
        '-vsync', '0',
        'test_out5.webp'
    ]);
    console.log("Done");
} catch(err) {
    console.error("error", err);
}
