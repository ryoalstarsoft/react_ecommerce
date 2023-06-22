import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import includes from 'lodash/includes'
import without from 'lodash/without'
import { withTrackingProvider } from '../../hoc'
import { TitleHeader } from '@yesplz/core-web/ui-kits/title-headers'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import IconOpenSrc from '@yesplz/core-web/assets/svg/accordion-circle-open.svg'
import IconClosedSrc from '@yesplz/core-web/assets/svg/accordion-circle-closed.svg'
import questions from './questions.js'
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
        {/* <InfoBanner style={styles.infoBanner} className='animated fadeInDown'>
          <h3>FAQ</h3>
          <p>All about YesPlz</p>
        </InfoBanner> */}
        <TitleHeader title='FAQ'>
          <span className='title'>FAQ</span>
        </TitleHeader>
        <div className={classes.root}>
          {
            questions.map((faq, index) => (
              <ExpansionPanel
                key={index}
                className={`Faq-section ${classes.panel}`}
                onChange={this.makeAccordionChangeHandler(index)}
                classes={{ expanded: 'expanded' }}>
                <ExpansionPanelSummary
                  expandIcon={<img src={includes(activePanels, index) ? IconOpenSrc : IconClosedSrc} alt='icon' />}
                  className={`HeadingWrapper ${classes.headingWrapper}`}
                  classes={{ expanded: 'expanded', expandIcon: 'expandIcon' }}>
                  <Typography className={classes.heading}>
                    <span>{index + 1}.</span>  {faq.title}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={`ExpansionPanelDetails ${classes.detail}`}>
                  <Typography className={classes.body}>
                    <span dangerouslySetInnerHTML={{ __html: faq.content }} />
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))
          }
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
    paddingBottom: 10,
    marginBottom: 20,
    borderBottom: '1px solid #979797',
    '&:before': {
      display: 'none'
    },
    '& > content': {
      display: 'none'
    },
    '&.expanded': {
      paddingBottom: 20
    }
  },
  headingWrapper: {
    paddingLeft: 30,
    paddingRight: 0,
    position: 'relative',
    '&.expanded': {
      minHeight: 48
    },
    '& > .expanded': {
      margin: '12px 0'
    },
    '& > .expandIcon': {
      width: 20,
      height: 20,
      position: 'absolute',
      left: 0,
      top: 12,
      margin: '12px 0'
    },
    '& > .expandIcon img': {
      width: '100%'
    }
  },
  heading: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    paddingLeft: 20,
    position: 'relative',
    '& > span': {
      position: 'absolute',
      top: 0,
      left: 0
    }
  },
  body: {
    color: 'rgba(0, 0, 0, 0.87)',
    paddingTop: 10,
    paddingLeft: 50
  },
  detail: {
    padding: 0
  }
})

export default compose(withStyles(styles), withTrackingProvider('FAQ'))(Faq)
