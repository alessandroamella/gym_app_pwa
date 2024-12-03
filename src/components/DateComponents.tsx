import {
  formatDistanceToNow,
  FormatDistanceToNowOptions,
  intervalToDuration,
  formatDuration,
  Duration,
  differenceInMinutes,
  format,
  differenceInSeconds,
} from 'date-fns';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { enUS, it } from 'date-fns/locale';
import type { i18n } from 'i18next';
import { WorkoutData } from '../types/workoutData';

const getLocale = (i18n: i18n) => (i18n.language === 'it' ? it : enUS);

interface FormatDistanceProps extends FormatDistanceToNowOptions {
  date: Date;
}

export const FormatDistance: FC<FormatDistanceProps> = ({
  date,
  includeSeconds,
  ...rest
}) => {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n);

  return formatDistanceToNow(date, {
    locale,
    includeSeconds: includeSeconds ?? true,
    ...rest,
  });
};

export const FormatDistanceRelative: FC<FormatDistanceProps> = ({
  date,
  ...rest
}) => {
  const { t } = useTranslation();

  if (differenceInSeconds(new Date(), date) < 60) {
    return t('date.now');
  } else {
    return <FormatDistance date={date} {...rest} />;
  }
};

interface FormatDurationProps
  extends Pick<WorkoutData, 'startDate' | 'endDate'>,
    FormatDistanceToNowOptions {}

export const FormatDuration: FC<FormatDurationProps> = ({
  startDate,
  endDate,
  addSuffix,
}) => {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n);

  const duration = intervalToDuration({
    start: startDate,
    end: endDate,
  });

  const durationMin = differenceInMinutes(endDate, startDate, {
    roundingMethod: 'ceil',
  });

  if (!durationMin) {
    console.error('Invalid duration:', duration);
    return <></>;
  }

  let str;
  if (durationMin < 1) {
    str = t('date.now');
  } else if (durationMin < 60) {
    str = t('date.nMin', { count: durationMin });
  } else if (durationMin / 60 < 24) {
    if (duration.minutes) {
      str = `${t('date.nHours', {
        count: duration.hours,
      })} ${t('date.nMin', { count: duration.minutes || 0 })}`;
    } else {
      str = t('date.nHours', {
        count: duration.hours,
      });
    }
  }

  if (str) {
    return addSuffix ? t('date.timeAgo', { time: str }) : str;
  }

  const format: (keyof Duration)[] =
    durationMin <= 60 ? ['minutes'] : ['hours', 'minutes'];

  str = formatDuration(duration, { locale, format });

  return addSuffix ? t('date.timeAgo', { time: str }) : str;
};

export const FormatHHMM: FC<{ date: Date }> = ({ date }) => {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n);

  return format(date, 'HH:mm', { locale });
};
