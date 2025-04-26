import React, { Fragment, useState } from 'react'
import styles from './videoInvestment.module.css'
import LoadingOverlay from 'react-loading-overlay-ts';
import PriceWithDiff from '../prices/PriceWithDiff';
import { numify } from "numify";

const VideoInvestment = ({video, me}) => {
  const [loadingSell, setLoadingSell] = useState(false)
  function getCrashChanceForMilestone(pnl) {
    if (pnl >= 2000) return 0.70;
    if (pnl >= 1000) return 0.60;
    if (pnl >= 500) return 0.45; 
    if (pnl >= 400) return 0.33; 
    if (pnl >= 300) return 0.28; 
    if (pnl >= 200) return 0.20; 
    if (pnl >= 100) return 0.17; 
    return 0;
  }
            const hoursSinceUpload = (Number(video.video_metadata.snippet.hoursSinceUpload)).toFixed(1)
            const nextMilestoneRange = (Math.abs((video.profit_percent - (video.lastMilestone/100)))+1)*100
            console.log(nextMilestoneRange)
            console.log(video)
            return(
              <LoadingOverlay
              active={loadingSell}
              spinner
              text='Selling..'>
                <div className={me ? [ styles.investmentContainer , styles.me ].join(" ") : styles.investmentContainer}>
                <div className={styles.topVideoStat}>
                  <div className={styles.titleAndThumbnail} onClick={() => window.open(`https://youtube.com/watch?v=${video.video_metadata.id}`)}>
                    <img src={video.video_metadata.snippet.thumbnails.default.url} className={styles.investedThumbnail}/>
                  <h3  className={styles.investedVideoTitle}>{video.video_metadata.snippet.title}</h3>
                  </div>
                  <div className={styles.ratioStat}>
                    <h1>{video?.curr_ratio ? (Number(video.curr_ratio.toFixed(3)) > 0.00001 && video?.curr_ratio?.toFixed(3) || "<0.00001") || "N/A" : "..."}</h1>
                  <div className={styles.ratioStatProfitContainer} >
                    {video.curr_ratio && 
                    <Fragment>
                      <PriceWithDiff value={((video.holdingProfit.toFixed(2) || 0.00))} diff={((video.profit_percent.toFixed(2) || 0.00))}/>
                    </Fragment>
                    }
                    </div>
                  </div>
                  </div>
                
                <div className={styles.bottomVideoStat}>
                  <div className={styles.videoMetric}>
                    <h2 className={styles.videoMetricNumber}>{Number(video.video_metadata.statistics.viewCount).toLocaleString()}</h2> <p>Current Views</p>
                  </div>
                  <div className={styles.videoMetric}>
                    <h2 className={styles.videoMetricNumber}>{video.crashed? "💥" : ""}{numify(Number(video.investment_total_before_crash.toFixed(2)))}</h2> <p>Initially Invested</p>
                  </div>
                  <div className={styles.videoMetric}>
                    <h2 className={styles.videoMetricNumber}>{Number(video.initial_view_count).toLocaleString()}</h2> <p>Views at Investment</p>
                  </div>
                  <div className={styles.videoMetric}>
                    <h2 className={styles.videoMetricNumber}>{numify(Number(hoursSinceUpload))}</h2> <p>Hours Since Upload</p>
                  </div>
                  {
                    video?.videoAngelInvestor &&
                    <div className={styles.angelInvestor}>
                    <b>Angel Investor</b>: <>{me ? "You" : video?.videoAngelInvestor || null}</> 
                  </div>
                  }
                  
                </div>
                {
                  video.crashed ?
                  <b><p>{video.crashed && "Crashed at "+video.crashAt+"% returns 💥"}</p></b>
                  :
                  <b><p>{video.lastMilestone > 0 && "Dodged a meltdown at "+((Number(video.lastMilestone) / 100))+"x returns 🔥"}</p></b>
                }
                {
                 (nextMilestoneRange <= 70) 
                &&
                <b><p style={video?.videoAngelInvestor && {paddingBottom: '20px'}}>
                "Your position is overheating... there's a {`${(getCrashChanceForMilestone((Number(video.lastMilestone)+100))*100).toFixed(0)}%` || ""} chance of a meltdown at {(Number(video.lastMilestone)+100)}% returns!"
                </p></b>
}
              </div>
              </LoadingOverlay>
              
              
            
  )
}

export default VideoInvestment