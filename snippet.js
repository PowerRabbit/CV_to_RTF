(function (global_object) {

    'use strict';

    var window = global_object,
        document = window.document,
        body = document.body,
        data,
        rtf = {},
        slice = Function.prototype.call.bind(Array.prototype.slice),
        collectInfoForEachEntry,
        collectData,
        transferToUnicodeForRTF,
        prepareRTF,
        downloadDocument;

    rtf.text = '';
    rtf.addHeader = function (txt) {
        this.text += '{\\rtlch\\fcs1 \\af31507 \\ltrch\\fcs0 \\f26 ' + txt + ' }\\n';
    };
    rtf.addParagraph = function (txt) {
        this.text += '{\\rtlch\\fcs1 \\af31507 \\ltrch\\fcs0 \\f26 ' + txt + ' }\\n';
    };
    rtf.toString = function () {
        var result_text = '{\\rtf1\\adeflang1025\\ansi\\n{\\fonttbl\\n{\\f26\\fbidi \\froman\\fcharset204\\fprq2{\\*\\panose 010a0502050306030303}Sylfaen;}\\n}\\n' + this.text + '\\n}';
        return result_text;
    };

    prepareRTF = function (dt) {
        dt.forEach(function (group) {
            rtf.addHeader(group.header);
            group.entries.forEach(function (entry) {
                rtf.addParagraph(entry);
            });
        });
    };

    collectInfoForEachEntry = function (el) {
        var text_array = [],
            elements = slice(el.nextElementSibling.querySelectorAll('h5 a'));

        elements.forEach(function (item) {
            text_array.push(transferToUnicodeForRTF(item.textContent));
        });
        return text_array;
    };

    collectData = function () {
        var dt = [],
            headers = slice(document.querySelectorAll('h4')),
            el,
            i;

        for (i = 0; i < 2; i += 1) {
            el = headers[i];
            dt.push({
                header: transferToUnicodeForRTF(el.textContent),
                entries: collectInfoForEachEntry(el)
            });
        }

        return dt;
    };

    transferToUnicodeForRTF = function (text) {
        var result = '',
            i;

        for (i = 0; i < text.length; i += 1) {
            result += '\\u' + ('000' + text[i].charCodeAt(0).toString()).substr(-4) + '\\\'3f';
        }
        return result;
    };

    downloadDocument = function (text) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(new window.Blob([text], {type: 'text/richtext'}));
        a.download = 'resume.rtf';

        body.appendChild(a);
        a.click();
        body.removeChild(a);
    };

    data = collectData();
    prepareRTF(data);
    downloadDocument(rtf);
}(this));