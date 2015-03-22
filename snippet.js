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

    collectInfoForEachEntry = function (el) {
        var data_array = [],
            parent = el.parentNode,
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

        return data_array;
    };

    collectData = function () {
        var dt = [],
            headers = slice(document.querySelectorAll('#background h3')),
            el,
            i;

        for (i = 0; i < headers.length; i += 1) {
            el = headers[i];
            dt.push({
                header: el.textContent,
                entries: collectInfoForEachEntry(el)
            });
        }

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
  //  prepareRTF(data);
    console.log(data);
  //  downloadDocument(rtf);
}(this));