import { formatDistanceToNow, FormatDistanceToNowOptions } from 'date-fns';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { enUS, it } from 'date-fns/locale';

interface FormatDistanceProps extends FormatDistanceToNowOptions {
  date: Date;
}

const FormatDistance: FC<FormatDistanceProps> = ({ date, ...props }) => {
  const { i18n } = useTranslation();
  return (
    <>
      {formatDistanceToNow(date, {
        locale: props.locale ?? i18n.language === 'it' ? it : enUS,
        includeSeconds: props.includeSeconds ?? true,
        ...props,
      })}
    </>
  );
};

export default FormatDistance;
