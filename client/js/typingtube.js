$(document).ready(function () {
    if (screen.width < 768) { 
        // console.log('hello');
        // $("#toggle").click( function(event){
        //     console.log('toggle clicked!')
        //     event.preventDefault();
        //     if ($(this).hasClass("isDown") ) {
        //         $( ".navbar-fixed-top" ).animate({ "margin-top": "-48px" }, "fast" );  
        //         $( "body" ).animate({ "margin-top": "5px" }, "fast" );
        //         $(this).removeClass("isDown");
        //     } else {
        //         $( ".navbar-fixed-top" ).animate({ "margin-top": "0px" }, "fast" );
        //         $( "body" ).animate({ "margin-top": "80px" }, "fast" );
        //         $(this).addClass("isDown");
        //     }
        //     return false;
        // });
        // $("#toggle").addClass("isDown");
        // $("#toggle").click();
    }

})

var STTS ={
   "ADJA":  
      {
         "DESCRIPTION": "attributives Adjektiv",
         "EXAMPLES": "\[das\] große \[Haus\]"
      }
   ,
   "ADJD" :
      {
         "DESCRIPTION": "adverbiales oder prädikatives Adjektiv",
         "EXAMPLES": "\[er fährt\] schnell, \[er ist\] schnell"
      }
   ,  
   "ADV" :
      {
         "DESCRIPTION": "Adverb",
         "EXAMPLES": "schon, bald, doch"
      }
   ,
   "APPR" :
      {
         "DESCRIPTION": "Präposition; Zirkumposition links",
         "EXAMPLES": "in \[der Stadt, ohne \[mich\]"
      }
   ,
   "APPRART" :
      {
         "DESCRIPTION": "Präposition mit Artikel",
         "EXAMPLES": "im \[Haus, zur \[Sache\]"
      }
   ,
   "APPO" :
      {
         "DESCRIPTION": "Postposition",
         "EXAMPLES": "\[ihm\] zufolge, \[der Sache\] wegen"
      }
   ,
   "APZR" :
      {
         "DESCRIPTION": "Zirkumposition rechts",
         "EXAMPLES": "\[von jetzt\] an"
      }
   ,
   "ART" :
      {
         "DESCRIPTION": "bestimmter oder unbestimmter Artikel",
         "EXAMPLES": "der, die, das, ein, eine"
      }
   ,
   "CARD" :
      {
         "DESCRIPTION": "Kardinalzahl",
         "EXAMPLES": "zwei \[Männer, \[im Jahre\] 1994"
      }
   ,
   "FM" :
      {
         "DESCRIPTION": "Fremdsprachliches Material",
         "EXAMPLES": "\[Er hat das mit ``\] A big fish \['' übersetzt\]"
      }
   ,
   "ITJ" :
      {
         "DESCRIPTION": "Interjektion",
         "EXAMPLES": "mhm, ach, tja"
      }
   ,
   "KOUI" :
      {
         "DESCRIPTION": "unterordnende Konjunktion mit ``zu'' und Infinitiv",
         "EXAMPLES": "um \[zu leben, anstatt \[zu fragen\]"
      }
   ,
   "KOUS" :
      {
         "DESCRIPTION": "unterordnende Konjunktion mit Satz",
         "EXAMPLES": "weil, dass, damit, wenn, ob"
      }
   ,
   "KON" :
      {
         "DESCRIPTION": "nebenordnende Konjunktion",
         "EXAMPLES": "und, oder, aber"
      }
   ,
   "KOKOM" :
      {
         "DESCRIPTION": "Vergleichskonjunktion",
         "EXAMPLES": "als, wie"
      }
   ,
   "NN" :
      {
         "DESCRIPTION": "normales Nomen",
         "EXAMPLES": "Tisch, Herr, \[das\] Reisen"
      }
   ,
   "NE" :
      {
         "DESCRIPTION": "Eigennamen",
         "EXAMPLES": "Hans, Hamburg, HSV"
      }
   ,
   "PDS" :
      {
         "DESCRIPTION": "substituierendes Demonstrativpronomen",
         "EXAMPLES": "dieser, jener"
      }
   ,
   "PDAT" :
      {
         "DESCRIPTION": "attribuierendes Demonstrativpronomen",
         "EXAMPLES": "jener \[Mensch\]"
      }
   ,
   "PIS" :
      {
         "DESCRIPTION": "substituierendes Indefinitpronomen",
         "EXAMPLES": "keiner, viele, man, niemand"
      }
   ,
   "PIAT" :
      {
         "DESCRIPTION": "attribuierendes Indefinitpronomen ohne Determiner",
         "EXAMPLES": "kein \[Mensch\], irgendein \[Glas\]"
      }
   ,
   "PIDAT" :
      {
         "DESCRIPTION": "attribuierendes Indefinitpronomen mit Determiner",
         "EXAMPLES": "\[ein\] wenig \[Wasser, \[die\] beiden \[Brüder\]"
      }
   ,
   "PPER" :
      {
         "DESCRIPTION": "irreflexives Personalpronomen",
         "EXAMPLES": "ich, er, ihm, mich, dir"
      }
   ,
   "PPOSS" :
      {
         "DESCRIPTION": "substituierendes Possessivpronomen",
         "EXAMPLES": "meins, deiner"
      }
   ,
   "PPOSAT" :
      {
         "DESCRIPTION": "attribuierendes Possessivpronomen",
         "EXAMPLES": "mein \[Buch\], deine \\[Mutter\]"
      }
   ,
   "PRELS" :
      {
         "DESCRIPTION": "substituierendes Relativpronomen",
         "EXAMPLES": "\\[der Hund ,\] der"
      }
   ,
   "PRELAT" :
      {
         "DESCRIPTION": "attribuierendes Relativpronomen",
         "EXAMPLES": "\\[der Mann ,\] dessen \\[Hund\]"
      }
   ,
   "PRF" :
      {
         "DESCRIPTION": "reflexives Personalpronomen",
         "EXAMPLES": "sich, einander, dich, mir"
      }
   ,
      "PROAV":
   {
       "DESCRIPTION": "Pronominaladverb",
         "EXAMPLES": "Deswegen/PROAV sprechen wir darüber/PROAV"
   },

   "PWS" :
      {
         "DESCRIPTION": "substituierendes Interrogativpronomen",
         "EXAMPLES": "wer, was"
      }
   ,
   "PWAT" :
      {
         "DESCRIPTION": "attribuierendes Interrogativpronomen",
         "EXAMPLES": "welche\\[Farbe\], wessen \\[Hut\]"
      }
   ,
   "PWAV" :
      {
         "DESCRIPTION": "adverbiales Interrogativ- oder Relativpronomen",
         "EXAMPLES": "warum, wo, wann, worüber, wobei"
      }
   ,
   "PAV" :
      {
         "DESCRIPTION": "Pronominaladverb",
         "EXAMPLES": "dafür, dabei, deswegen, trotzdem"
      }
   ,
   "PTKZU" :
      {
         "DESCRIPTION": "``zu'' vor Infinitiv",
         "EXAMPLES": "zu \\[gehen\]"
      }
   ,
   "PTKNEG" :
      {
         "DESCRIPTION": "Negationspartikel",
         "EXAMPLES": "nicht"
      }
   ,
   "PTKVZ" :
      {
         "DESCRIPTION": "abgetrennter Verbzusatz",
         "EXAMPLES": "\\[er kommt\] an, \\[er fährt\] rad"
      }
   ,
   "PTKANT" :
      {
         "DESCRIPTION": "Antwortpartikel",
         "EXAMPLES": "ja, nein, danke, bitte"
      }
   ,
   "PTKA" :
      {
         "DESCRIPTION": "Partikel bei Adjektiv oder Adverb",
         "EXAMPLES": "am \\[schönsten\], zu \\[schnell\]"
      }
   ,
   "TRUNC" :
      {
         "DESCRIPTION": "Kompositions-Erstglied",
         "EXAMPLES": "An- \\[und Abreise\]"
      }
   ,
   "VVFIN" :
      {
         "DESCRIPTION": "finites Verb, voll",
         "EXAMPLES": "\[du\\] gehst, \[wir\\] kommen \[an\]"
      }
   ,
   "VVIMP" :
      {
         "DESCRIPTION": "Imperativ, voll",
         "EXAMPLES": "komm \[!\]"
      }
   ,
   "VVINF" :
      {
         "DESCRIPTION": "Infinitiv, voll",
         "EXAMPLES": "gehen, ankommen"
      }
   ,
   "VVIZU" :
      {
         "DESCRIPTION": "Infinitiv mit ``zu'', voll",
         "EXAMPLES": "anzukommen, loszulassen"
      }
   ,
   "VVPP" :
      {
         "DESCRIPTION": "Partizip Perfekt, voll",
         "EXAMPLES": "gegangen, angekommen"
      }
   ,
   "VAFIN" :
      {
         "DESCRIPTION": "finites Verb, aux",
         "EXAMPLES": "\[du\] bist, \[wir\] werden"
      }
   ,
   "VAIMP" :
      {
         "DESCRIPTION": "Imperativ, aux",
         "EXAMPLES": "sei \[ruhig !\]"
      }
   ,
   "VAINF" :
      {
         "DESCRIPTION": "Infinitiv, aux",
         "EXAMPLES": "werden, sein"
      }
   ,
   "VAPP" :
      {
         "DESCRIPTION": "Partizip Perfekt, aux",
         "EXAMPLES": "gewesen"
      }
   ,
   "VMFIN" :
      {
         "DESCRIPTION": "finites Verb, modal",
         "EXAMPLES": "dürfen"
      }
   ,
   "VMINF" :
      {
         "DESCRIPTION": "Infinitiv, modal",
         "EXAMPLES": "wollen"
      }
   ,
   "VMPP" :
      {
         "DESCRIPTION": "Partizip Perfekt, modal",
         "EXAMPLES": "gekonnt, \[er hat gehen\] können"
      }
   ,
   "XY" :
      {
         "DESCRIPTION": "Nichtwort, Sonderzeichen enthaltend",
         "EXAMPLES": "3:7, H2O, D2XW3"
      }
   ,
   "$," :
      {
         "DESCRIPTION": "Komma",
         "EXAMPLES": ","
      }
   ,
   "$." :
      {
         "DESCRIPTION": "Satzbeendende Interpunktion",
         "EXAMPLES": ". ? ! ; :"
      }
   ,
   "$(" :
      {
         "DESCRIPTION": "sonstige Satzzeichen; satzintern",
         "EXAMPLES": "- \[,\]()"
      }
   
}

function getSTTS(code)
{
    if(STTS[code])
    {
        return STTS[code].DESCRIPTION;
    }
    else
    {
        return ""
    }
}