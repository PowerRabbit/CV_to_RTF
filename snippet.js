(function (global_object) {

    'use strict';

    var window = global_object,
        document = window.document,
        body = document.body,
        data,
        rtf = {},

        SUMMARY = 'summary',
        EXPERIENCE = 'experience',
        PROJECTS = 'projects',
        SKILLS = 'skills',
        LANGUAGES = 'languages',
        EDUCATION = 'education',
        ORGANIZATIONS = 'organizations',
        INTERESTS = 'interests',
        COURSES = 'courses',
        PUBLICATIONS = 'publications',
        HONORS = 'honors',
        ADDITIONAL = 'additional',

        H5 = 'h5',
        H4 = 'h4',
        TIME = 'time',
        LOCATION = 'location',
        DESCRIPTION = 'description',

        slice = Function.prototype.call.bind(Array.prototype.slice),
        getDataObj,
        getSkills,
        collectInfoForEachEntry,
        collectData,
        transferToUnicodeForRTF,
        prepareRTF,
        downloadDocument;

    rtf.text = '';
    rtf.style = '{\\stylesheet{\\s0\\snext0\\ql\\nowidctlpar\\ltrpar{\\*\\hyphen2\\hyphlead2\\hyphtrail2\\hyphmax0}\\cf1\\kerning1\\dbch\\af8\\langfe2052\\dbch\\af9\\afs24\\alang1081\\loch\\f5\\fs24\\lang1049 Normal;}\n{\\s1\\sbasedon15\\snext16\\ilvl0\\outlinelevel0\\ql\\nowidctlpar\\sb240\\sa120\\keepn\\ltrpar\\cf1\\b\\kerning1\\dbch\\af7\\langfe2052\\dbch\\af9\\afs36\\alang1081\\ab\\loch\\f6\\fs36\\lang1049 \\u1047\\\'17\\u1072\\\'30\\u1075\\\'33\\u1086\\\'3e\\u1083\\\'3b\\u1086\\\'3e\\u1074\\\'32\\u1086\\\'3e\\u1082\\\'3a 1;}\n{\\s2\\sbasedon15\\snext16\\ilvl1\\outlinelevel1\\ql\\nowidctlpar\\sb200\\sa120\\keepn\\ltrpar\\cf1\\b\\kerning1\\dbch\\af7\\langfe2052\\dbch\\af9\\afs32\\alang1081\\ab\\loch\\f6\\fs32\\lang1049 \\u1047\\\'17\\u1072\\\'30\\u1075\\\'33\\u1086\\\'3e\\u1083\\\'3b\\u1086\\\'3e\\u1074\\\'32\\u1086\\\'3e\\u1082\\\'3a 2;}\n{\\s3\\sbasedon15\\snext16\\ilvl2\\outlinelevel2\\ql\\nowidctlpar\\sb140\\sa120\\keepn\\ltrpar\\cf2\\b\\kerning1\\dbch\\af7\\langfe2052\\dbch\\af9\\afs28\\alang1081\\ab\\loch\\f6\\fs28\\lang1049 \\u1047\\\'17\\u1072\\\'30\\u1075\\\'33\\u1086\\\'3e\\u1083\\\'3b\\u1086\\\'3e\\u1074\\\'32\\u1086\\\'3e\\u1082\\\'3a 3;}\n}';
    rtf.addHeader2 = function (txt) {
        this.text += '\\s2\\ilvl1\\outlinelevel1\\ql\\nowidctlpar\\sb200\\sa120\\keepn\\ltrpar\\cf1\\b\\kerning1\\dbch\\af7\\langfe2052\\dbch\\af9\\afs32\\alang1081\\ab\\loch\\f6\\fs32\\lang1049{\\listtext\\pard\\plain \\tab}\\ls1 \\li576\\ri0\\lin576\\rin0\\fi-576{\\alang1025\\rtlch \\ltrch\\loch\\loch\\f4 ' + txt + ' }\\n \\par \\n';
    };
    rtf.addHeader3 = function (txt) {
        this.text += '\\par \\pard\\plain \\s3\\ilvl2\\outlinelevel2\\ql\\nowidctlpar\\sb140\\sa120\\keepn\\ltrpar\\cf2\\b\\kerning1\\dbch\\af7\\langfe2052\\dbch\\af9\\afs28\\alang1081\\ab\\loch\\f6\\fs28\\lang1049{\\listtext\\pard\\plain }\\ilvl2\\ls2 \\li2160\\ri0\\lin2160\\rin0\\fi-360\\li720\\ri0\\lin720\\rin0\\fi-720{\\alang1025\\rtlch \\ltrch\\loch\\loch\\f4 ' + txt + ' }\\n \\par \\n';
    };
    rtf.addBreak = function () {
        this.text += '\par \\n';
    };
    rtf.addParagraph = function (txt) {
        this.text += '{\\rtlch\\fcs1 \\af31507 \\ltrch\\fcs0 \\f26 ' + txt + ' }\\n';
    };
    rtf.toString = function () {
        var result_text = '{\\rtf1\\adeflang1025\\ansi\\n{\\fonttbl{\\f0\\froman\\fprq2\\fcharset0 Times New Roman;}{\\f1\\froman\\fprq2\\fcharset2 Symbol;}{\\f2\\fswiss\\fprq2\\fcharset0 Arial;}{\\f3\\froman\\fprq2\\fcharset204 Liberation Serif{\\*\\falt Times New Roman};}{\\f4\\fswiss\\fprq2\\fcharset1 Arial;}{\\f5\\froman\\fprq0\\fcharset1 Liberation Serif{\\*\\falt Times New Roman};}{\\f6\\fswiss\\fprq0\\fcharset1 Liberation Sans{\\*\\falt Arial};}{\\f7\\fnil\\fprq2\\fcharset204 Microsoft YaHei;}{\\f8\\fnil\\fprq2\\fcharset204 Arial;}{\\f9\\fnil\\fprq0\\fcharset1 Mangal;}}\\n' + this.style + this.text + '\\n}';
        return result_text;
    };

    prepareRTF = function (dt) {
        dt.forEach(function (group) {
            rtf.addHeader2(transferToUnicodeForRTF(group.header));
            switch (group.type) {
            case SUMMARY:
                
                break;
            case EXPERIENCE:
                
                break;
            case PROJECTS:
                
                break;
            case SKILLS:
                
                break;
            }
            
            /* group.entries.forEach(function (entry) {
                rtf.addParagraph(entry);
            }); */
        });
    };

    getDataObj = function (el) {
        var result = {},
            h4 = el.querySelector('h4'),
            exp_date_loc = h4.parentNode.nextElementSibling,
            time = slice(exp_date_loc.querySelectorAll('time')),
            time_string = '',
            h5 = el.querySelectorAll('h5'),
            h5_string = '',
            location = exp_date_loc.querySelector('.locality'),
            location_string = '',
            duration = '',
            duration_loc,
            present = '',
            description = el.querySelector('p.description');

        if (h5.length) {
            h5_string = h5[h5.length - 1].textContent;
        }

        if (location) {
            location_string = location.textContent;
        }

        if (description) {
            description = description.innerHTML.split('<br>').join('\n');
        }

        slice(exp_date_loc.childNodes).forEach(function (node) {
            if (node.nodeType === 3 && node.textContent.length > 3) {
                duration_loc = node.textContent.split(' (').reverse();

                if (duration_loc[1] !== undefined) {
                    duration = '(' + duration_loc[0];
                    present = duration_loc[1];
                } else {
                    duration = duration_loc[0];
                    present = '';
                }
            }
        });

        if (time.length) {
            time_string += time[0].textContent;
            if (time[1]) {
                time_string += ' &mdah; ' + time[1].textContent;
            } else {
                if (present.length) {
                    time_string += present;
                }
            }
            time_string += ' ' + duration;
        }

        result[H4] = h4.textContent;
        result[H5] = h5_string;
        result[TIME] = time_string;
        result[LOCATION] = location_string;
        result[DESCRIPTION] = description || '';

        return result;
    };

    getSkills = function (el) {
        var ul = slice(el.parentNode.parentNode.querySelectorAll('.skills-section > li')),
            text,
            int_part,
            result = [];

        ul.forEach(function (li) {
            if (li.id !== 'see-more-less-skill') {
                text = li.textContent;
                if (isNaN(text)) {
                    int_part = parseInt(text, 10);

                    if (!isNaN(int_part)) {
                        text = text.substr((int_part + '').length);
                    }
                    result.push(text);
                }
            }
        });
        return result;
    };

    collectInfoForEachEntry = function (el) {
        var data_array = [],
            parent = el.parentNode,
            header = el.textContent,
            grand_parent = parent.parentNode,
            block_type = grand_parent.id.split('-')[1];

        switch (block_type) {
        case SUMMARY:
            data_array.push(parent.nextElementSibling.querySelector('.description').textContent);
            break;
        case EXPERIENCE:
            while (el.nextElementSibling && el.nextElementSibling.tagName.toLowerCase() === 'div') {
                el = el.nextElementSibling;
                data_array.push(getDataObj(el));
            }
            break;
        case PROJECTS:
            while (el.nextElementSibling && el.nextElementSibling.tagName.toLowerCase() === 'div') {
                el = el.nextElementSibling;
                data_array.push(getDataObj(el));
            }
            break;
        case SKILLS:
            data_array.push(getSkills(el));
            break;
        case LANGUAGES:

            break;
        case EDUCATION:

            break;
        case ORGANIZATIONS:

            break;
        case INTERESTS:

            break;
        case COURSES:

            break;
        case PUBLICATIONS:

            break;
        case HONORS:

            break;
        case ADDITIONAL:

            break;
        }

        return {
            header: header,
            type: block_type,
            entries: data_array
        };
    };

    collectData = function () {
        var dt = [],
            headers = slice(document.querySelectorAll('#background h3'));

        headers.forEach(function (header) {
            dt.push(collectInfoForEachEntry(header));
        });

        return dt;
    };

    transferToUnicodeForRTF = function (text) {
        var result = '',
            i;

        for (i = 0; i < text.length; i += 1) {
            result += '\\u' + text[i].charCodeAt() + '\\\'3f';
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
    console.log(data);
    downloadDocument(rtf);
}(this));