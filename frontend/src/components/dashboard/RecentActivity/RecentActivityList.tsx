import React, { Fragment } from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useTheme } from '@mui/material/styles'

import dayjs from 'dayjs'
import { LogEntry, LogLevel } from '~/models/log'

interface RecentActivityListProps {
  logEntries: LogEntry[]
}

/**
 * List of recent log entries
 */
export const RecentActivityList: React.FC<RecentActivityListProps> = (
  props
) => {
  const theme = useTheme()

  const logLevelToIcon: { [key in LogLevel]: React.ReactNode } = {
    [LogLevel.INFO]: (
      <InfoOutlinedIcon sx={{ color: theme.onTertiaryContainer }} />
    ),
    [LogLevel.WARN]: (
      <WarningAmberOutlinedIcon sx={{ color: theme.onWarnContainer }} />
    ),
    [LogLevel.ERROR]: (
      <ReportOutlinedIcon sx={{ color: theme.onErrorContainer }} />
    ),
  }
  const logLevelToIconBackground: { [key in LogLevel]: string } = {
    [LogLevel.INFO]: theme.tertiaryContainer,
    [LogLevel.WARN]: theme.warnContainer,
    [LogLevel.ERROR]: theme.errorContainer,
  }

  return (
    <List sx={{ width: '100%' }}>
      {props.logEntries.slice(0, 4).map((entry: LogEntry) => (
        <Fragment key={entry.id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                sx={{ background: logLevelToIconBackground[entry.level] }}
              >
                {logLevelToIcon[entry.level]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={entry.message}
              secondary={dayjs(entry.timestamp).format('YYYY-MM-DD, HH:mm:ss')}
              sx={{
                '> .MuiListItemText-primary': {
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  /* Clip to only show the first two lines */
                  WebkitLineClamp: '2',
                  lineClamp: '2',
                },
              }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Fragment>
      ))}
    </List>
  )
}
