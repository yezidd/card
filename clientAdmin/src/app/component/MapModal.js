/**
 * Created by yzdd on 2018/4/5.
 */
import React, {Component} from 'react';
import {Button, Dialog, Form, Select, Input, Loading, Message} from "element-react";
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap'

export default class MapModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogVisible2: false,
      dialogVisible3: false,
      fullscreen: false,
      form: {
        name: '',
      }
    };
  }

  show = () => {
    this.setState({
      dialogVisible3: true
    })
  };

  getEvents() {
    return {
      click: (e) => {
        console.log('map click event', e);
      }
    }
  }

  render() {
    return (
      <div>
        <Dialog
          visible={this.state.dialogVisible3}
          onCancel={() => this.setState({dialogVisible3: false})}
        >
          <Dialog.Body>
            <Map center={{lng: 116.402544, lat: 39.928216}} zoom="11" events={this.getEvents()}>
              <Marker position={{lng: 116.402544, lat: 39.928216}} />
              <NavigationControl />
              <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/>
            </Map>
          </Dialog.Body>
        </Dialog>
        {
          this.state.fullscreen && <Loading fullscreen={true}/>
        }
      </div>
    );
  }
}