/**
  This file is part of VED DECODE v1.0

  Copyright © 2013 Deed Poll Office Ltd, UK

  VED DECODE is free software: you can redistribute it and/or modify
  it under the terms of the Apache License, Version 2.0 (the "License").
  You may not use this work except in compliance with the License.

  You should have received a copy of the License in the LICENSE file,
  along with this program.  If not, you can get a copy of the license at:
  <http://www.apache.org/licenses/LICENSE-2.0>.

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */

var VedDecode = VedDecode || {};
(function(_, w) {
    if (!w.atob) w.atob = base64.decode;
    var linkTypes = {
	    '22'  : 'normal (universal) search result',
	    '1146': 'normal result thumbnail (e.g. for an application, recipe, etc.)',
	    '1150': 'normal result thumbnail (e.g. for an application, recipe, etc.)',
	    '2060': 'sitelink',
	    '338' : 'one-line sitelink',
	    '745' : 'breadcrumb',
	    '586' : '“Jump to” link',
	    '300' : 'more results link (listed mainly for Q&A websites)',
	    '288' : 'local search result',
	    '1455': 'local search result marker pin icon',
	    '5497': 'dictionary definition link',
	    '152' : 'blog search result',
	    '232' : 'book search result',
	    '235' : 'book search result thumbnail',
	    '1140': 'book search result author link',
	    '245' : 'image search result in basic (non-javascript) image search, or image result in universal search',
	    '429' : 'image search result [probably not in use any more]',
	    '3588': 'image search result (thumbnail)',
	    '3598': 'image search result preview title link',
	    '3724': 'image search result preview grey website link underneath title',
	    '3597': 'image search result preview thumbnail',
	    '3596': 'image search result preview “View image” link',
	    '3599': 'image search result preview “Visit page” link',
	    '5077': 'in-depth article result',
	    '5078': 'in-depth article result thumbnail',
	    '1701': 'map search result',
	    '612' : 'map search result website link',
	    '646' : 'map search result thumbnail',
	    '297' : 'news result',
	    '295' : 'news result thumbnail',
	    '2237': 'news result video thumbnail',
	    '1532': 'news sub-result (i.e. the same story from a different site)',
	    '232' : 'patent result',
	    '235' : 'patent result thumbnail',
	    '1107': 'patent result “Overview” / “Related” / “Discuss” link',
	    '371' : 'shopping search result',
	    '311' : 'video result',
	    '312' : 'video result thumbnail',
	    '2937': 'authorship thumbnail link',
	    '2847': 'authorship “by [author]” link',
	    '2459': 'knowledge graph link',
	    '3836': 'knowledge graph main image',
	    '1732': 'knowledge graph repeated sub-link (e.g. football team squad players, album track listings)',
	    '1617': 'adword (i.e. sponsored search result)',
	    '706' : 'adword sitelink',
	    '5158': 'adword one-line sitelink',
	    '1987': 'sponsored shopping result (in main column of universal search results)',
	    '1986': 'sponsored shopping result thumbnail (in main column of universal search results)',
	    '1908': 'sponsored shopping result (in right-hand column of universal search results)',
	    '1907': 'sponsored shopping result thumbnail (in right-hand column of universal search results)'
	    },
        matches = w.document.referrer.match(/[\/.]google\..*[?&]ved=([a-zA-Z0-9_-]+)\b/);

    if (_.ved = matches && matches.length && ved_decode(matches[1]) || null) {
	_.linkIndex         = _.ved[1] || null;
	_.linkType          = linkTypes[_.ved[2]] || _.ved[2] || null;
	_.resultPosition    = _.ved[6] !== undefined ? _.ved[6] + 1 : null;
	_.subResultPosition = _.ved[5] !== undefined ? _.ved[5] + 1 : null;
	_.page              = (_.ved[7] || 0) / 10 + 1;
    }

    function ved_decode(ved) {
	var keys = { t: 2, r: 6, s: 7, i: 1 }, ret = {}, re, match;
	if (ved.match(/^1/)) {
	    re = /([a-z]+):([0-9]+)/ig;
	    while ((match = re.exec(ved)) !== null)
		ret[keys[match[1]] || match[1]] = parseInt(match[2], 10);
	    return ret;
	}
        ved = ved.replace(/_/, '+').replace('-', '/');
        ved = w.atob((ved + "===").slice(1, ved.length + 3 - (ved.length + 2) % 4));
	re  = /([\x80-\xff]*[\x00-\x7f])([\x80-\xff]*[\x00-\x7f])/g;
	while ((match = re.exec(ved)) !== null)
	    ret[varint_decode(match[1]) >> 3] = varint_decode(match[2]);
	return ret;
	function varint_decode(vint) {
	    var ret = 0, i = 0;
	    for (; i < vint.length; ++i) ret += (vint.charCodeAt(i) & 0x7f) << (i * 7);
	    return ret;
	}
    }
})(VedDecode, window);
