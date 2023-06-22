import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import includes from 'lodash/includes'
import without from 'lodash/without'
import withTrackingProvider from '@yesplz/core-web/hoc/withTrackingProvider'
import { InfoBanner } from '@yesplz/core-web/ui-kits/banners'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import IconOpenSrc from '@yesplz/core-web/assets/svg/accordion-circle-open.svg'
import IconClosedSrc from '@yesplz/core-web/assets/svg/accordion-circle-closed.svg'
import questions from '@yesplz/core-web/modules/faq/questions'
import './faq.css'

class Faq extends Component {
  static propTypes = {
    classes: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      activePanels: []
    }
  }

  makeAccordionChangeHandler (key) {
    return (_, expanded) => {
      const { activePanels } = this.state
      let nextActivePanels = activePanels
      if (expanded) {
        nextActivePanels = [...activePanels, key]
      } else {
        nextActivePanels = without(activePanels, key)
      }

      this.setState({ activePanels: nextActivePanels })
    }
  }

  render () {
    const { classes } = this.props
    const { activePanels } = this.state

    return (
      <div id='MainScroll' className='Faq'>
        <InfoBanner className={`animated fadeInDown ${classes.infoBanner}`}>
          <div className='container'>
            <h1>FAQ</h1>
            <p className={classes.infoBannerDescription}>All about YesPlz</p>
          </div>
        </InfoBanner>
        <div className='faqs-questions container'>
          <div className={classes.root}>
            {
              questions.map((faq, index) => (
                <ExpansionPanel key={index} className={classes.panel} onChange={this.makeAccordionChangeHandler(index)}>
                  <ExpansionPanelSummary
                    expandIcon={<img src={includes(activePanels, index) ? IconOpenSrc : IconClosedSrc} />}
                    className={classes.headingWrapper}
                    classes={{ expanded: 'expanded', expandIcon: 'expandIcon' }}>
                    <Typography className={classes.heading}>
                      <span>{index + 1}.</span>  {faq.title}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.detail}>
                    <Typography className={classes.body}>
                      <span dangerouslySetInnerHTML={{ __html: faq.content }} />
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    padding: '20px 25px'
  },
  panel: {
    boxShadow: 'none',
    paddingBottom: 50,
    marginBottom: 50,
    borderBottom: '1px solid #979797',
    '&:before': {
      display: 'none'
    },
    '& > content': {
      display: 'none'
    }
  },
  headingWrapper: {
    paddingLeft: 80,
    paddingRight: 0,
    position: 'relative',
    '& > .expanded': {
      margin: '12px 0'
    },
    '& > .expandIcon': {
      position: 'absolute',
      left: 0,
      top: 25,
      margin: '12px 0'
    }
  },
  heading: {
    fontSize: 36,
    color: 'rgba(0, 0, 0, 0.6)',
    paddingLeft: 50,
    position: 'relative',
    '& > span': {
      position: 'absolute',
      top: 0,
      left: 0
    }
  },
  body: {
    fontSize: 36,
    color: 'rgba(0, 0, 0, 0.87)',
    paddingTop: 20,
    paddingLeft: 130
  },
  detail: {
    padding: 0
  },
  infoBanner: {
    padding: '30px 20px 40px'
  },
  infoBannerDescription: {
    fontSize: '36px!important'
  }
})

export default compose(withStyles(styles), withTrackingProvider('FAQ'))(Faq)
