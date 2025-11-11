/**
 * Debug component to track re-renders
 * Use this to identify infinite render loops
 */

import { useRef, useEffect } from 'react';

interface RenderCounterProps {
  name: string;
  props?: Record<string, any>;
}

export const RenderCounter: React.FC<RenderCounterProps> = ({ name, props = {} }) => {
  const renderCountRef = useRef(0);
  const prevPropsRef = useRef<Record<string, any>>(props);

  useEffect(() => {
    renderCountRef.current += 1;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[RenderCounter] ${name} rendered #${renderCountRef.current}`, {
        props,
        prevProps: prevPropsRef.current,
        changedProps: Object.keys(props).filter(
          (key) => props[key] !== prevPropsRef.current[key]
        ),
      });

      // Warn if too many renders
      if (renderCountRef.current > 10) {
        console.warn(`[RenderCounter] ${name} has rendered ${renderCountRef.current} times! Possible infinite loop.`);
      }
    }

    prevPropsRef.current = props;
  });

  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          fontSize: '10px',
          zIndex: 9999,
        }}
      >
        {name}: {renderCountRef.current}
      </div>
    );
  }

  return null;
};



