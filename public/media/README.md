# Media Folder

Place audio files here. The timer will play audio based on the `exerciseStyle` of each exercise.

## Expected Audio Files

| Filename         | Exercise Style |
|------------------|----------------|
| cardio.mp3       | cardio         |
| hiit.mp3         | hiit           |
| heavybag.mp3     | heavybag       |
| shadowbox.mp3    | shadowbox      |
| stretch.mp3      | stretch        |
| rest.mp3         | rest           |
| core.mp3         | core           |
| strength.mp3     | strength       |
| circuit.mp3      | circuit        |
| burpees.mp3      | burpees        |
| jumprope.mp3     | jumprope       |
| start.mp3        | played when the workout begins      |
| complete.mp3     | played when the workout finishes    |
| countdown.mp3    | played during final 3 seconds of each interval |

All files should be placed directly in this `public/media/` folder.
When running the dev server or built app, they are served at `/media/<filename>`.
