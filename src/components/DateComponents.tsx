import {
  formatDistanceToNow,
  FormatDistanceToNowOptions,
  intervalToDuration,
  formatDuration,
  Duration,
  differenceInMinutes,
  format,
  isToday,
  isYesterday,
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

export const FormatDistance: FC<FormatDistanceProps> = ({ date, ...props }) => {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n);

  return formatDistanceToNow(date, {
    locale,
    includeSeconds: props.includeSeconds ?? true,
    ...props,
  });
};

export const FormatDistanceRelative: FC<FormatDistanceProps> = ({ date }) => {
  const { t } = useTranslation();

  if (isToday(date)) {
    return t('date.today');
  } else if (isYesterday(date)) {
    return t('date.yesterday');
  } else return <FormatDuration startDate={date} endDate={new Date()} />;
};

interface FormatDurationProps
  extends Pick<WorkoutData, 'startDate' | 'endDate'> {}

export const FormatDuration: FC<FormatDurationProps> = ({
  startDate,
  endDate,
}) => {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n);

  const duration = intervalToDuration({
    start: startDate,
    end: endDate,
  });

  const durationMin = differenceInMinutes(endDate, startDate);

  if (!durationMin) {
    console.error('Invalid duration:', duration);
    return <></>;
  }

  if (durationMin < 1) {
    return t('date.now');
  } else if (durationMin < 60) {
    return t('date.nMin', { count: durationMin });
  } else if (durationMin / 60 < 24) {
    if (duration.minutes) {
      return `${t('date.nHr', {
        count: duration.hours,
      })} ${t('date.nMin', { count: duration.minutes || 0 })}`;
    } else {
      return t('date.nHr', {
        count: duration.hours,
      });
    }
  }

  const format: (keyof Duration)[] =
    durationMin <= 60 ? ['minutes'] : ['hours', 'minutes'];

  return formatDuration(duration, { locale, format });
};

export const FormatHHMM: FC<{ date: Date }> = ({ date }) => {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n);

  return format(date, 'HH:mm', { locale });
};