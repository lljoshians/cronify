import { useState, useCallback } from 'react';
import { PRESETS } from '../components/PresetSelector';

export function usePresets(onApply) {
  const [lastApplied, setLastApplied] = useState(null);

  const applyPreset = useCallback(
    (value) => {
      const preset = PRESETS.find((p) => p.value === value);
      if (!preset) return;
      setLastApplied(preset);
      if (typeof onApply === 'function') {
        onApply(preset.value);
      }
    },
    [onApply]
  );

  const getMatchingPreset = useCallback(
    (cronValue) => PRESETS.find((p) => p.value === cronValue) || null,
    []
  );

  const randomPreset = useCallback(() => {
    const idx = Math.floor(Math.random() * PRESETS.length);
    return PRESETS[idx];
  }, []);

  return {
    presets: PRESETS,
    lastApplied,
    applyPreset,
    getMatchingPreset,
    randomPreset,
  };
}
