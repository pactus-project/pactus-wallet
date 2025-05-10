import { RefObject, Ref, useCallback } from 'react';

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>) {
  return (node: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object' && 'current' in ref) {
        (ref as RefObject<T | null>).current = node;
      }
    });
  };
}

export default function useMergeRef<T>(
  ...refs: Array<Ref<T> | undefined | null>
): (node: T | null) => void {
  return useCallback(mergeRefs<T>(...refs), [refs]);
}
