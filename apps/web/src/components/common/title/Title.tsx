interface TitleProps {
  content: string;
}

function Title({ content }: TitleProps) {
  return (
    <h3 className="text-text-primary tablet:!text-xl font-medium !leading-tight text-lg">
      {content}
    </h3>
  );
}

export default Title;
