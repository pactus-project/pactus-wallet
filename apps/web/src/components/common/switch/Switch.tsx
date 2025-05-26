import * as SwitchRadix from '@radix-ui/react-switch';

interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchRadix.Root>, 'onChange'> {
  onChange?: (value: boolean) => void;
  error?: boolean;
}

function Switch({ onChange, ...props }: SwitchProps) {
  return (
    <SwitchRadix.Root
      onCheckedChange={onChange}
      className="w-[36px] h-[20px] bg-[#EBEBEB] data-[state=checked]:bg-[#60D26C] rounded-full relative outline-none border-none cursor-pointer"
      {...props}
    >
      <Thumb />
    </SwitchRadix.Root>
  );
}

const Thumb: React.FC = () => (
  <SwitchRadix.Thumb
    className={`
      block w-4 h-4 bg-white rounded-full
      transition-transform duration-100 will-change-transform
      translate-x-[-4px] data-[state=checked]:translate-x-[12px]
      drop-shadow-[0_1px_2px_rgba(16,24,40,0.06)] 
      drop-shadow-[0_1px_3px_rgba(16,24,40,0.10)]
      relative
      after:content-[''] after:hidden after:absolute after:top-1/2 after:left-1/2
      after:-translate-x-1/2 after:-translate-y-1/2 after:w-[2px] after:h-[6px]
      after:rounded-full after:bg-[#ccc]
      data-[state=checked]:after:block data-[state=checked]:after:bg-[#60D26C]
    `}
  />
);

Switch.Thumb = Thumb;

export default Switch;
