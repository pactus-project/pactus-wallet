import { useEffect, useState } from "react";

function useControlledState<T>({ value, onChange }: { value?: T; onChange?: (value: T) => void }): [T | undefined, (value: T) => void] {
    const [state, setState] = useState<T | undefined>(value);

    useEffect(() => {
        if (value !== undefined) {
            setState(value);
        }
    }, [value]);

    const handleChange = (newValue: T) => {
        setState(newValue);
        onChange?.(newValue);
    };

    return [state, handleChange];
}

export default useControlledState;