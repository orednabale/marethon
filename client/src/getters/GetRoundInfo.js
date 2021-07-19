import React from "react";
import { Card, CardTitle, Row, Col, Table } from 'reactstrap';


class GetRoundInfo extends React.Component {

  constructor(props) {
    super(props);
    this.web3 = this.props.drizzle.web3;
    this.state = {
      dateKey: null
    };
  }  

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const dataPageKey = contract.methods["getGameInfo"].cacheCall(this.props.round);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey : dataPageKey });
  }

  render() {

    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    let gameInfo = Marethon.getGameInfo[this.state.dataKey];

    if (gameInfo) 
      return (    
            <React.Fragment>  
            <CardTitle>Round Info</CardTitle>
            <Row>
              <Col>
                <Table responsive size="sm" style={{ backgroundColor: '#778899', tableLayout: 'fixed'}}>
                <tbody>
                  <tr>
                    <td style={{textAlign:'right'}}>Round : </td>
                    <td><b>{this.props.round}</b></td>
                  </tr>
                  <tr>
                    <td style={{textAlign:'right'}}>Status : </td>
                    <td><b>{gameInfo.value[0] == 0 ? 'Not yet started' :
                            gameInfo.value[0] == 1 ? 'Registration' :
                            gameInfo.value[0] == 2 ? 'On Going' :
                            gameInfo.value[0] == 3 ? 'Game Ended' :
                            'Game Closed' }</b></td>
                  </tr>
                  <tr>
                    <td style={{textAlign:'right'}}>Race Start : </td>
                    <td><b>{(gameInfo.value[4] == '0' ? 'Race starts a week after Active Round ends' : 
                          (new Date(gameInfo.value[4]*1000)).toUTCString())}</b></td>
                  </tr>
                  <tr>
                    <td style={{textAlign:'right'}}>Race End : </td>
                    <td><b>{gameInfo.value[5] == '0' ? 'N/A' : gameInfo.value[5]}</b></td>
                  </tr>
                </tbody>
                </Table>
              </Col>
              <Col>
                <Table responsive size="sm" style={{ backgroundColor: '#778899', tableLayout: 'fixed'}}>
                <tbody>
                  <tr>
                    <td style={{textAlign:'right'}}>Runners : </td>
                    <td><b>{gameInfo.value[1]}</b></td>
                  </tr>
                  <tr>
                    <td style={{textAlign:'right'}}>Winners : </td>
                    <td><b>{gameInfo.value[7] == '0' ? 'None yet' : gameInfo.value[7]}</b></td>
                  </tr>
                  <tr>
                    <td style={{textAlign:'right'}}>Total Pot : </td>
                    <td><b>{this.web3.utils.fromWei(gameInfo.value[8])} ETH</b></td>
                  </tr>
                  <tr>
                    <td style={{textAlign:'right'}}>User's Pot : </td>
                    <td><b>{this.web3.utils.fromWei(gameInfo.value[9])} ETH</b></td>
                  </tr>
                </tbody>
                </Table>
              </Col>
            </Row>      
            </React.Fragment>              
        );
    else
      return <div>Retrieving Round Info...</div>;
  }
}

export default GetRoundInfo;
