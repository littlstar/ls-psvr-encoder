# ls-psvr-encoder

A simple command line tool to encode your 180 and 360 videos for sideloading with Littlstar's VR Cinema app for PSVR.

## Dependencies

ls-psvr-encoder has been tested on several flavors of Linux (Ubuntu, Debian, Arch, CentOS) and the latest macOS. Windows is not yet supported.

This is a Node CLI application, so Node.JS is required.

Also the following binary applications are required:

* FFmpeg compiled with `libx264` and `libfdk_aac` support
* FFprobe
* MP4Box

See https://www.ffmpeg.org and https://gpac.wp.imt.fr for information about the dependencies.

## Video Compatibility

Any equirectangular 180 or 360 video, either monoscopic or stereoscopic, should work fine with this tool. If your source video is footage taken straight from the RAW output of a high-end camera, or if your source video is packaged in one of the more esoteric containers that are out there, you may need to convert or re-mux as necessary so that the file can be read via FFmpeg.

## Usage

Basic functionality is achieved by running `node index.js -i /path/to/video.mp4`. This will assume default values regarding the input video (monoscopic, 360) and will output to the same directory that holds the input file (in this case, `/path/to`). The output file will be renamed to match the PSVR app's requirements, i.e. `/path/to/video_psvr.mp4`.

To get more granular options, run `node index.js -h` for a more detailed help output:

```
$ node index.js -h

Usage: index.js -i /path/to/video.mp4 [options]

Options:
  -i, --input            Input video path                             [required]
  -d, --degrees          Specify video degrees
                                   [required] [choices: 180, 360] [default: 360]
  -t, --type             Input video type
                     [required] [choices: "sbs", "ou", "mono"] [default: "mono"]
  -o, --outputDirectory  Output directory (default: same as input path)
  -h, --help             Show help                                     [boolean]

Examples:
  node index.js -i myvideo.mp4              encode myvideo.mp4 with default
                                            options (360 degrees, monoscopic,
                                            outputs to same dir as input)
  node index.js -i myvideo.mp4 -d 180 -t    encode 180 degree over-under
  ou                                        stereoscopic video
  node index.js -i myvideo.mp4 -d 360 -t    encode 360 degree side-by-side
  sbs -o /work/encodes                      stereoscopic video, output to
                                            /work/encodes directory

Email media@littlstar.com for assistance/accolades.

Copyright 2017 Little Star Media, Inc.
```
