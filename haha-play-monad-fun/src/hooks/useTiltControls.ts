
import { useEffect, useRef } from 'react';

export const useTiltControls = (jumpCallback: () => void, isActive: boolean) => {
  const lastTiltRef = useRef<number>(0);
  const tiltThresholdRef = useRef<number>(15); // Degrees to trigger jump

  useEffect(() => {
    if (!isActive) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null) return;

      const currentTilt = event.beta; // Forward/backward tilt
      const tiltChange = Math.abs(currentTilt - lastTiltRef.current);

      // Detect significant forward tilt (jumping motion)
      if (currentTilt < -tiltThresholdRef.current && tiltChange > 10) {
        jumpCallback();
        lastTiltRef.current = currentTilt;
      } else if (Math.abs(currentTilt) < 5) {
        // Reset reference when device is relatively flat
        lastTiltRef.current = currentTilt;
      }
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          }
        } catch (error) {
          console.log('Device orientation permission denied');
        }
      } else {
        // For browsers that don't require permission
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [jumpCallback, isActive]);
};
