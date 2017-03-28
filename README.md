# ls-psvr-encoder

A simple command line tool to encode your 180 and 360 videos for sideloading with Littlstar's VR Cinema app for PSVR.

## Dependencies

ls-psvr-encoder has been tested on several flavors of Linux (Ubuntu, Debian, Arch, CentOS) and the latest macOS. Windows is not yet supported.

This is a Node CLI application, so Node.JS and npm are both required.

Also the following binary applications are required:

* FFmpeg compiled with `libx264` and `libfdk_aac` support
* FFprobe
* MP4Box

**macOS users can use the following binary builds for [FFmpeg](https://evermeet.cx/ffmpeg/ffmpeg-3.2.4.dmg) and [MP4Box](http://download.tsi.telecom-paristech.fr/gpac/latest_builds/macosx_64/gpac-0.6.2-DEV-latest-master.dmg)**

See https://www.ffmpeg.org and https://gpac.wp.imt.fr for information about the dependencies.

## Video Compatibility

Any equirectangular 180 or 360 video, either monoscopic or stereoscopic, should work fine with this tool. If your source video is footage taken straight from the RAW output of a high-end camera, or if your source video is packaged in one of the more esoteric containers that are out there, you may need to convert or re-mux as necessary so that the file can be read via FFmpeg.

## Usage

To get started, elicit the following command (may require sudo): `npm install littlstar/ls-psvr-encoder -g`

Basic functionality is achieved by running `lspe -i /path/to/video.mp4`. This will assume default values regarding the input video (monoscopic, 360) and will output to the same directory that holds the input file (in this case, `/path/to`). The output file will be renamed to match the PSVR app's requirements, i.e. `/path/to/video_psvr.mp4`.

To get more granular options, run `lspe -h` for a more detailed help output.
