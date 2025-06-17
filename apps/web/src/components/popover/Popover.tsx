import * as RadixPopover from "@radix-ui/react-popover";
import { ReactNode } from "react";
import useControlledState from "@/hooks/useControlledState";

interface PopoverProps extends Omit<RadixPopover.PopoverContentProps, 'children' | 'forceMount'> {
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    defaultOpen?: boolean;
    trigger?: ReactNode;
    anchor?: ReactNode;
    container?: HTMLElement;
    modal?: boolean;
    zIndex?: number;
    forceMount?: boolean;
    onOpenAutoFocus?: (event: Event) => void;
    classNames?: {
        root?: string;
        trigger?: string;
        content?: string;
    };
}

interface TriggerProps extends RadixPopover.PopoverTriggerProps {
    children: ReactNode;
    className?: string;
}

function Popover({
    children,
    open,
    onOpenChange,
    onClose,
    defaultOpen,
    trigger,
    align,
    sideOffset = 5,
    alignOffset,
    classNames,
    anchor,
    container,
    modal,
    zIndex,
    forceMount,
    onOpenAutoFocus,
    ...props
}: PopoverProps) {
    const [ _open, _onOpenChange ] = useControlledState({ value: open, onChange: onOpenChange });

    return (
        <RadixPopover.Root
            defaultOpen={defaultOpen}
            open={_open}
            modal={modal}
            onOpenChange={(open) => {
                if (!open) {
                    onClose?.();
                }
                _onOpenChange?.(open);
            }}
        >
            {!!trigger && <Trigger className={classNames?.trigger}>{trigger}</Trigger>}
            {anchor}
            <RadixPopover.Portal container={container}>
                <RadixPopover.Content
                    {...props}
                    style={{ zIndex, ...props.style }}
                    align={align}
                    alignOffset={alignOffset}
                    sideOffset={sideOffset}
                    className={classNames?.content}
                    forceMount={forceMount as true | undefined}
                    onOpenAutoFocus={onOpenAutoFocus}
                >
                    {children}
                </RadixPopover.Content>
            </RadixPopover.Portal>
        </RadixPopover.Root>
    );
}

function Trigger({ children, className, ...props }: TriggerProps) {
    return (
        <RadixPopover.Trigger {...props} className={className} asChild>
            {children}
        </RadixPopover.Trigger>
    );
}

Object.assign(Popover, RadixPopover);
Popover.Trigger = Trigger;

export default Popover;
