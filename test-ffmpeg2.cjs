const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
ffmpeg.setFfmpegPath(ffmpegPath);

function createVideoSticker(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .inputOptions(['-y'])
            .outputOptions([
                '-vcodec libwebp',
                '-vf scale=\'min(512,iw)\':min\'(512,ih)\':force_original_aspect_ratio=decrease,fps=12,pad=512:512:-1:-1:color=white@0.0,format=rgba',
                '-lossless 0',
                '-compression_level 6',
                '-q:v 50',
                '-loop 0',
                '-preset picture',
                '-an',
                '-vsync 0'
            ])
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}

createVideoSticker('real_test.mp4', 'test_out4.webp')
    .then(() => {
        console.log("Done");
        console.log("Size:", fs.statSync('test_out4.webp').size);
    })
    .catch(console.error);
