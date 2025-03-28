import React, { Fragment } from 'react'
import styles from './historyInvestment.module.css'

const HistoryInvestment = ({video}) => {
  const profit_loss = video?.curr_ratio > video?.initial_ratio
  const hoursSinceUpload = (Number(video?.video_metadata.snippet?.hoursSinceUpload || 0.00)).toFixed(1)
  console.log(video)
  return (
    <div className={styles.investmentContainer}>
        <h3 className={styles.investmentType} style={video.investmentType == "BUY" ? {color: 'green'}: {color: 'red'}}>{video.investmentType}</h3>
      <div className={styles.topVideoStat}>
        <div className={styles.titleAndThumbnail} onClick={() => window.open(`https://youtube.com/watch?v=${video.video_metadata.id}`)}>
          <img src={video.video_metadata.snippet.thumbnails.default.url} className={styles.investedThumbnail}/>
        <h3  className={styles.investedVideoTitle}>{video.video_metadata.snippet.title}</h3>
        </div>
        </div>
      
      <div className={styles.bottomVideoStat}>
        <div className={styles.videoMetric}>
          <h2 className={styles.videoMetricNumber}>{Number(video.investment_total.toFixed(2)).toLocaleString()}</h2> <p>Initially Invested</p>
        </div>
        <div className={styles.videoMetric}>
          <h2 className={styles.videoMetricNumber}>{Number(video.initial_view_count).toLocaleString()}</h2> <p>Views at Investment</p>
        </div>
      </div>
    </div>
  )
}

export default HistoryInvestment