library google_location_picker_web;

import 'dart:convert';
import 'dart:html';

import 'package:flutter/material.dart';
import 'UiFake.dart' if (dart.library.html) 'dart:ui' as ui;

class GoogleLocationPickerWeb extends StatefulWidget {
  const GoogleLocationPickerWeb({Key key, this.apiKey}) : super(key: key);

  @override
  _GoogleLocationPickerWebState createState() => _GoogleLocationPickerWebState();

  final String apiKey;



}

class _GoogleLocationPickerWebState extends State<GoogleLocationPickerWeb> {

  String formattedAddress;
  double latitude;
  double longitude;

  @override
  Widget build(BuildContext context) {

    ui.platformViewRegistry.registerViewFactory("gmaps-html", (int viewId){

      IFrameElement element = IFrameElement();

      window.onMessage.forEach((element) {

        print('Event received in callback : ${element.data}');

        if(element.data){
          var data = json.decode(element.data);
          setState(() {
            this.formattedAddress = data['formattedAddress'];
            this.latitude = data['latitude'];
            this.longitude = data['longitude'];

            print(this.formattedAddress);
            print(this.latitude);
            print(this.longitude);
          });
        }

      });

      element.requestFullscreen();
      element.src='assets/html/maps.html';
      element.style.border = 'none';
      return element;

    });

    return Scaffold(
        body: Builder(builder: (BuildContext context) {
          return Container(
            child: HtmlElementView(viewType: 'gmaps-html'),
          );
        }));
  }
}

