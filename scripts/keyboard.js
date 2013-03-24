var Keyboard = function(){
  this.rows = []; 
}
Keyboard.prototype.add = function(row,top,bottom,mod){
  var key = {};
  var charCode = 0;
  if(!this.rows[row]){
    this.rows.push({keys:[]});
  }
  key = {top:top,bottom:bottom,modifier:mod};
  switch(bottom){
    case 'delete':
      charCode = 8;
      break;
    case 'tab':
      charCode = 9;
      break;
    case 'enter':
      charCode = 13;
      break;
    case 'shift':
      charCode = 16;
      break;
    case 'space':
      charCode = 32;
      break;
    case 'ctrl':
      charCode = 17;
      break;
    case 'alt':
      charCode = 18;
      break;
    case 'cmd':
      charCode = 91;
      break;
    case '`':
      charCode = 192;
      break;
    case '\'':
      charCode = 222;
      break;
    case ';':
      charCode = 186;
      break;
    case '-':
      charCode = 189;
      break;
    case '=':
      charCode = 187;
      break;
    case '[':
      charCode = 219;
      break;
    case ']':
      charCode = 221;
      break;
    case '\\':
      charCode = 220;
      break;
    case 'caps lock':
      charCode = 20;
      break;
    case ',':
      charCode = 188;
      break;
    case '.':
      charCode = 190;
      break;
    case '/':
      charCode = 191;
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      charCode = bottom.charCodeAt(0);
      break;
    default:
      charCode = top.charCodeAt(0);
      break;
  }
  key.charCode = charCode;
  this.rows[row].keys.push(key);
};
var keyboard = new Keyboard();
keyboard.add(0,'~','`')
keyboard.add(0,'!','1')
keyboard.add(0,'@','2')
keyboard.add(0,'#','3')
keyboard.add(0,'$','4')
keyboard.add(0,'%','5')
keyboard.add(0,'^','6')
keyboard.add(0,'&','7')
keyboard.add(0,'*','8')
keyboard.add(0,'(','9')
keyboard.add(0,')','0')
keyboard.add(0,'_','-')
keyboard.add(0,'+','=')
keyboard.add(0,'&nbsp;','delete','delete')

keyboard.add(1,'&nbsp;','tab','tab')
keyboard.add(1,'Q','q')
keyboard.add(1,'W','w')
keyboard.add(1,'E','e')
keyboard.add(1,'R','r')
keyboard.add(1,'T','t')
keyboard.add(1,'Y','y')
keyboard.add(1,'U','u')
keyboard.add(1,'I','i')
keyboard.add(1,'O','o')
keyboard.add(1,'P','p')
keyboard.add(1,'{','[')
keyboard.add(1,'}',']')
keyboard.add(1,'|','\\')

keyboard.add(2,'&nbsp;','caps lock', 'capslock')
keyboard.add(2,'A','a')
keyboard.add(2,'S','s')
keyboard.add(2,'D','d')
keyboard.add(2,'F','f')
keyboard.add(2,'G','g')
keyboard.add(2,'H','h')
keyboard.add(2,'J','j')
keyboard.add(2,'K','k')
keyboard.add(2,'L','l')
keyboard.add(2,':',';')
keyboard.add(2,'"','\'')
keyboard.add(2,'&nbsp;','enter','enter')

keyboard.add(3,'&nbsp;','shift','shift')
keyboard.add(3,'Z','z')
keyboard.add(3,'X','x')
keyboard.add(3,'C','c')
keyboard.add(3,'V','v')
keyboard.add(3,'B','b')
keyboard.add(3,'N','n')
keyboard.add(3,'M','m')
keyboard.add(3,'<',',')
keyboard.add(3,'>','.')
keyboard.add(3,'?','/')
keyboard.add(3,'&nbsp;','shift','shift')

keyboard.add(4,'&nbsp;','&nbsp;')
keyboard.add(4,'&nbsp;','ctrl')
keyboard.add(4,'&nbsp;','alt')
keyboard.add(4,'&nbsp;','cmd')
keyboard.add(4,'&nbsp;','space','space')
keyboard.add(4,'&nbsp;','cmd')
keyboard.add(4,'&nbsp;','alt')

var html = Mustache.render( $("#rowTemplate").html(), keyboard);
$("#keyboard").append(html);

var startTimes = []; 
var endTimes   = [];

function startTimer(e){
  if(typeof(startTimes[e.keyCode]) == "undefined" || startTimes[e.keyCode] === null){
    startTimes[e.keyCode] = new Date();
  }
}
function stopTimer(e){
  var timeElapsedMs   = 0;
  endTimes[e.keyCode] = new Date();

  timeElapsedMs = endTimes[e.keyCode] - startTimes[e.keyCode];


  if(timeElapsedMs > 1000){
    outputJs(e);
  }
  startTimes[e.keyCode] = null;
  endTimes[e.keyCode]   = null;

}
function outputJs(e){
  var js = [];
  var conditionals = [];
  js.push("function handleKeyDown(e){");
  conditionals.push("    if(e.keyCode == " + e.keyCode);
  if(e.shiftKey){
    conditionals.push(" && e.shiftKey == " + e.shiftKey);
  }
  if(e.ctrlKey){
    conditionals.push(" && e.ctrlKey == " +  e.ctrlKey); 
  }
  if(e.altKey){
     js.push(" && e.altKey == " + e.altKey );
  }
  conditionals.push("){");
  js.push(conditionals.join(''));
  js.push("    //do something");
  js.push("  }");
  js.push("}");

  var html = Mustache.render( $("#jsOutputTemplate").html(), {output:js.join("<br/>").replace(/\s/g,'&nbsp;')});
  $("#output").prepend(html);
}

window.onkeydown = function(e){
  startTimer(e);
  _.each(keyboard.rows,function(row){

    var found = _.find(row.keys,function(key){
      return key.charCode == e.keyCode; 
    });

    if( typeof(found) !== "undefined"){
      $("#"+found.charCode).addClass("pressed");
    }
  });

  return false;
};

window.onkeyup = function(e){
  stopTimer(e);
  _.each(keyboard.rows,function(row){
    var found = _.find(row.keys,function(key){
      return key.charCode == e.keyCode; 
    });
    if( typeof(found) !== "undefined"){
      $("#"+found.charCode).removeClass("pressed");
    }
  });

  return false;
}
