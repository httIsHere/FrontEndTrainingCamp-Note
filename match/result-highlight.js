/*
 * @Author: httishere
 * @Date: 2021-09-18 16:40:48
 * @LastEditTime: 2021-09-18 17:10:43
 * @LastEditors: Please set LastEditors
 * @Description: 搜索页面相关全局操作
 * @FilePath: /Note/match/result-highlight.js
 */


/**
 * @description: 高亮搜索结果关键字
 * @param {*} keyword, target_dom(需要高亮的区域, 可以直接使用dom也可以使用字符串)
 * @return {*} void
 */
function searchResultsHighLight(target_dom, keyword) {
  let k = encodeFilter(keyword);
  let _keyword = k ? encodeFilter(keyword).toLowerCase() : "";
  let _keyword_length = _keyword.length; // 关键字长度
  for (let i in target_dom) {
    let original_html = target_dom[i].innerText, // 当前检查元素的原始数据
      result_html = "";
    if (original_html) {
      let lower_html = original_html.toLowerCase(), // 忽略大小写限制
        lower_html_list = [], // 除关键字外的其他字符
        lower_combine = ""; // 匹配过程中的过程状态
      lower_html_list = lower_html ? lower_html.split(_keyword) : []; // 根据关键字分割小写处理后的内容
      for (let item of lower_html_list) {
        let _length = item.length;
        let start = lower_combine.length + _length,
          end = start + _keyword_length;
        let t_start = lower_combine.length, t_end = t_start + _length;
        let o_item = original_html.slice(t_start, t_end);
        let o_k = original_html.slice(start, end); // 获取原始关键字（包括大小写）
        lower_combine += item + o_k; // 保存当前进度
        // 对关键字进行高亮包装
        o_k
          ? (result_html +=
              o_item + `<span class="result-highlight">${o_k}</span>`)
          : (result_html += o_item);
      }
    }

    target_dom[i].innerHTML = result_html;
  }
}

// 清除特殊字符，仅保留字母，中文和数字
function encodeFilter(keyword) {
  const pattern =
    /[`\-~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
  return keyword.replace(pattern, "");
}

// 不检查大小写
function searchResultsHighLight2(target_dom, keyword) {    
    let _keyword = encodeFilter(keyword);
    for(let i in target_dom) {
        let original_html = target_dom[i].innerText, result_html = '';
        // 直接对数据进行关键字分割和包装拼接
        original_html_list = original_html ? original_html.split(_keyword) : [];
        result_html = original_html_list.join(`<span class="result-highlight">${_keyword}</span>`);
        target_dom[i].innerHTML = result_html;
    }
}
