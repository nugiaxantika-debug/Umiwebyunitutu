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
                '-vf scale=\'min(256,iw)\':min\'(256,ih)\':force_original_aspect_ratio=decrease,fps=10,pad=256:256:-1:-1:color=white@0.0,format=rgba',
                '-lossless 0',
                '-compression_level 6',
                '-qscale 50',
                '-loop 0',
                '-preset default',
                '-an',
                '-vsync 0'
            ])
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}

createVideoSticker('real_test.mp4', 'test_out3.webp')
    .then(() => {
        console.log("Done");
        console.log("Size:", fs.statSync('test_out3.webp').size);
    })
    .catch(console.error);
