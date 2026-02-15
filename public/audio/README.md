# Calm Mode Audio Setup

## Required Audio File

Place your calm ambient audio file at:
```
public/audio/calm-ambient.mp3
```

## Audio Requirements

- **Format**: MP3
- **Duration**: 2-5 minutes (will loop automatically)
- **Type**: Calming ambient sounds (rain, ocean, forest, meditation music)
- **Quality**: 128-192 kbps (balance between quality and file size)
- **Volume**: Pre-normalized to comfortable listening level

## Recommended Free Audio Sources

1. **FreePD** - https://freepd.com (Public Domain)
2. **Free Music Archive** - https://freemusicarchive.org
3. **Incompetech** - https://incompetech.com
4. **YouTube Audio Library** - Royalty-free music

## Audio Suggestions

Good calming tracks to search for:
- Rain sounds
- Ocean waves
- Forest ambiance
- Meditation music
- Soft piano
- Nature sounds

## Testing Without Audio

If you don't have an audio file yet, the component will gracefully handle the missing file and show an error in the console. The UI will still function, but playback will fail.

## Production Checklist

- [ ] Add calm-ambient.mp3 to public/audio/
- [ ] Test audio playback in Chrome
- [ ] Test audio playback in Firefox
- [ ] Test audio playback in Safari
- [ ] Verify volume control works
- [ ] Verify loop works correctly
- [ ] Test on mobile devices
- [ ] Verify no autoplay violations
- [ ] Check file size (recommend < 5MB)

## File Size Optimization

If your audio file is too large:
```bash
# Using ffmpeg to compress
ffmpeg -i input.mp3 -b:a 128k -ac 1 public/audio/calm-ambient.mp3
```

This converts to mono 128kbps, significantly reducing file size while maintaining quality for ambient sounds.
