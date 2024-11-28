import { useEffect, useState } from 'react';

const useIsStandalone = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  const isMobile = () => window.innerWidth <= 768; // Simple check for mobile devices based on width

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.navigator as any).standalone;
      setIsStandalone(isStandaloneMode && isMobile());
    };

    checkStandalone();

    // Listen for screen resize to re-evaluate
    window.addEventListener('resize', checkStandalone);
    return () => window.removeEventListener('resize', checkStandalone);
  }, []);

  return isStandalone;
};

export default useIsStandalone;
