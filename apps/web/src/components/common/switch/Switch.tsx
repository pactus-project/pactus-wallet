import * as SwitchRadix from '@radix-ui/react-switch';

interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchRadix.Root>, 'onChange'> {
  onChange?: (value: boolean) => void;
  error?: boolean;
}

function Switch({ onChange, ...props }: SwitchProps) {
  delete props?.error;
  return (
    <SwitchRadix.Root
      onCheckedChange={onChange}
      className="w-[54px] h-[30px] bg-[#EBEBEB] data-[state=checked]:bg-gradient-primary rounded-full relative outline-none border-none cursor-pointer"
      {...props}
    >
      <Thumb />
    </SwitchRadix.Root>
  );
}

const Thumb: React.FC = () => (
  <SwitchRadix.Thumb
    className={`
      block w-6 h-6 bg-white rounded-full
      transition-transform duration-100 will-change-transform
      translate-x-[-11px] data-[state=checked]:translate-x-[11px]
      drop-shadow-[0_1px_2px_rgba(16,24,40,0.06)] 
      drop-shadow-[0_1px_3px_rgba(16,24,40,0.10)]
      relative
    `}
  />
);

Switch.Thumb = Thumb;

export default Switch;
