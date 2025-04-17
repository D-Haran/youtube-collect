import React, { Fragment } from 'react'
import styles from './historyInvestment.module.css'
import {numify} from "numify"

const HistoryInvestment = ({video}) => {
  return (
    <div className={styles.investmentContainer}>
      <div className={styles.typeContainer}>
        <h3 className={styles.investmentType} style={video.investmentType == "BUY" ? {color: 'green'}: {color: 'red'}}>{video?.investmentType}</h3>
      {
          (video.profit && video.investmentType == "SELL") &&
          <div className={styles.ratioStat} style={video?.profit >= 0 ? {color: '#107800'} : {color: '#cd0000'}}>
          <h3>{video?.profit >= 0 ? "+" : "-"}{video?.profit ? (numify(Number(video.profit.toFixed(2))) || "<0.00001") || "N/A" : "..."}</h3>
        </div>
        }
      </div>
        <div className={styles.topVideoStat}>
        <div className={styles.titleAndThumbnail} onClick={() => window.open(`https://youtube.com/watch?v=${video?.video_metadata?.id}`)}>
          <img src={video?.video_metadata?.snippet?.thumbnails?.default?.url} className={styles.investedThumbnail}/>
        <h3  className={styles.investedVideoTitle}>{video?.video_metadata?.snippet?.title}</h3>
        
        </div>
        
        
        </div>
      
      <div className={styles.bottomVideoStat}>
        <div className={styles.videoMetric}>
          {
            video.investmentType == "BUY" ?
            <>
            <h2 className={styles.videoMetricNumber}>{Number(video?.investment_total?.toFixed(2)).toLocaleString()}</h2> <p>Initially Invested</p>
            </>
            :
            <>
            <h2 className={styles.videoMetricNumber}>{Number(video?.viewsAtSell?.toFixed(2)).toLocaleString()}</h2> <p>Views At Sell</p>
            </>
            
          }
          
          
        </div>
        <div className={styles.videoMetric}>
          <h2 className={styles.videoMetricNumber}>{Number(video?.initial_view_count).toLocaleString()}</h2> <p>Views at Investment</p>
        </div>
      </div>
    </div>
  )
}

export default HistoryInvestment