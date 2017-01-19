/*
 * Dummy Image Generator.jsx Ver 1.0
 * Copyright (c) 2016 Yasutsugu Sasaki
 * http://2-hats.hateblo.jp
 *
 * Released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 *
 * To utilize this script, make in advance a csv file listing images you want.
 * The csv file should follow the following order.
 * 
 * 1) File Name
 * 2) Extentions(png, gif, jpg, or svg)
 * 3) Width(px)
 * 4) Height(px)
 * 5) Background Color(Optional)
 * 6) Text(Optional)
 */

#target illustrator

$.localize = true;
$.locale = null;

var max = 0;
var defaultBGColor = "#CCCCCC";

var dp = DocumentPreset;
    dp.colorMode = DocumentColorSpace.RGB;
    dp.width = 500;
    dp.height = 500;
    dp.previewMode = DocumentPreviewMode.PixelPreview;
    dp.rasterResolution = DocumentRasterResolution.ScreenResolution;
    dp.units = RulerUnits.Pixels;
      
var optionsPNG24 = new ExportOptionsPNG24();
    optionsPNG24.artBoardClipping = true;
      
var optionsGIF = new ExportOptionsGIF();
    optionsGIF.colorCount = 256;
    optionsGIF.artBoardClipping = true;
      
var optionsJPEG = new ExportOptionsJPEG();
    optionsJPEG.qualitySetting = 80;
    optionsJPEG.artBoardClipping = true;
      
var optionsSVG = new ExportOptionsSVG();
    optionsSVG.coordinatePrecision = 1;
    optionsSVG.cssProperties = SVGCSSPropertyLocation.STYLEELEMENTS;
    optionsSVG.documentEncoding = SVGDocumentEncoding.UTF8;
    optionsSVG.embedRasterImages = true;
    optionsSVG.fontSubsetting = SVGFontSubsetting.None;
    optionsSVG.fontType = SVGFontType.SVGFONT;

//Convert HEX to a RGBColor object.
function hex2Rgb(hex){
  var rgbColor = new RGBColor();
  if(hex.charAt(0) == "#") {
    hex = hex.substring(1,7);
  }
  rgbColor.red = parseInt(hex.substring(0,2),16);
  rgbColor.green  = parseInt(hex.substring(2,4),16);
  rgbColor.blue  = parseInt(hex.substring(4,6),16);
  return rgbColor;
}

//Export a image as a PNG, GIF, JPEG or SVG.
function create_dummy(folderPath, filename, extension, w, h, color, text){
  var filePath = folderPath + "/" + filename + "." + extension;
  extension = extension.toLowerCase();
  w = parseInt(w, 10);
  h = parseInt(h, 10);
  
  var fileObj = new File(filePath);
  var options = null;
  var exportType = null;
  dp.width = w;
  dp.height = h;
  
  var doc = app.documents.addDocument(DocumentColorSpace.RGB, dp);
  
  var rect = doc.activeLayer.pathItems.rectangle(h,0, w, h);
  rect.filled = true;
  rect.stroked = false;
  rect.fillColor = color ? hex2Rgb(color) : hex2Rgb(defaultBGColor );

  var txt = doc.activeLayer.textFrames.add();
  txt.contents = text ? text : filename + "." + extension;
  txt.contents += "\nW:" + w + " x H:" + h;
  txt.textRange.characterAttributes.fillColor = hex2Rgb("#333333");
  txt.paragraphs[0].paragraphAttributes.justification = Justification.LEFT;
  txt.paragraphs[1].paragraphAttributes.justification = Justification.LEFT;
  txt.position = [0, h];
  
  var options = null;
  var exportType = null;
  
  switch(extension){
    case "png":
      exportType = ExportType.PNG24;
      options = optionsPNG24;
      break;
    case "gif":
      exportType = ExportType.GIF;
      options = optionsGIF;
      break;
    case "jpg":
      exportType = ExportType.JPEG;
      options = optionsJPEG;
      break;
    case "svg":
      exportType = ExportType.SVG;
      options = optionsSVG;
      break;
    default:
      throw { en: 'The extensions must be "png", "gif", "jpg", or "svg". ', ja: '拡張子は"png, gif, jpg, svg"のいずれかで指定してください'};;
      break;
  }

  doc.exportFile(fileObj, exportType, options);
  
  doc.close(SaveOptions.DONOTSAVECHANGES);
}

try{
    //Read a list file
    var csvObj = File.openDialog ({ en: "Select a listing images file", ja: "画像リストファイル選択"}, "*.csv");
    if(!csvObj){ throw { en: "Canceled", ja: "キャンセルしました"};   }
    
    var flag = csvObj.open("r");
    if(!flag){ throw { en: "The file couldn't be read.", ja: "ファイルを読み込めませんでした"}; }
    
    if(!csvObj.length){ throw { en: "There is nothing in the file", ja: "リストファイルに何も含まれていません"};  };
    
    //Make a folder
    var folderObj= new Folder(csvObj.fullName.match(/(.*)(?:\.([^.]+$))/)[1] + "-dummy");
    if(!folderObj.exists) {
      folderObj.create();
    }

    //Export each image
    while(!csvObj.eof){
      var arguments = csvObj.readln().split(',');
      create_dummy(folderObj, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      max++;
    }
    csvObj.close();
    alert({ en: "It has made " + max + " dummy image files.", ja: "ダミー画像を" + max + "点作成しました。"});
} catch(e){
  alert(e)
}