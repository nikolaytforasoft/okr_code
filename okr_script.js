//for list OKRs ---------------------------------------------
function generate_objective(text, progress) {
  let objective = document.createElement('p');
  objective.style.margin = "10px 0 0 ";
  progress = Math.round(progress * 100);

  objective.innerHTML = '<strong>' + '(' + progress + '%' + ')' + ' ' + text + '</strong>';

  if (progress == 100) {
    objective.style.setProperty('text-decoration', 'line-through');
  }

  return objective
}

function generate_key_results(key_results) {
  let key_results_wrapper = document.createElement('ul');

  for (k of key_results) {
    let key_result = document.createElement('li');
    let progress = Math.round(k.progress * 100);

    key_result.innerText = '(' + progress + '%' + ')' + ' ' + k.text;

    if (progress == 100) {
      key_result.style.setProperty('text-decoration', 'line-through');
    }


    key_results_wrapper.appendChild(key_result)
  }

  return key_results_wrapper;
}

function generate_okr(objective) {
  let okr = document.createElement('div');

  let o = generate_objective(objective.text, objective.progress);
  let kr = generate_key_results(objective.key_results);

  okr.appendChild(o);
  okr.appendChild(kr);

  return okr;
}
//-------------------------------------------------------------------


const okr_block_template = '' +
  '        <div class="objective">\n' +
  '          <div class="expand_toggle_wrapper">\n' +
  '            <div class="expand_toggle">\n' +
  '              <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '                <path d="M1 1L5 5L1 9" stroke="#172B4D" stroke-width="1.5" stroke-linecap="round"/>\n' +
  '              </svg>\n' +
  '            </div>\n' +
  '          </div>\n' +
  '          <div class="objective_text">\n' +
  '            Все должны знать 🚀 \n' +
  '          </div>\n' +
  '        </div>\n' +
  '\n' +
  '        <div class="progressbar_section">\n' +
  '          <div class="dummy_block"></div>\n' +
  '          <div class="progressbar_wrapper">\n' +
  '            <div class="progressbar"></div>\n' +
  '            <div class="progress_percent">100%</div>\n' +
  '          </div>\n' +
  '        </div>\n';

const key_result_template = '' +
  '      <div class="key_result">\n' +
  '        <div class="key_result_text">\n' +
  '          <div class="key_result_icon">\n' +
  '            <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '              <circle cx="2" cy="2" r="2" fill="#42526E"/>\n' +
  '            </svg>\n' +
  '          </div>\n' +
  '          <div class="text">Внедрить OKR - у каждого отдела есть цели и ключевые результаты на квартал, раз в неделю\n' +
  '            обсуждаем прогресс\n' +
  '          </div>\n' +
  '        </div>\n' +
  '        <div class="key_result_progressbar_section">\n' +
  '          <div class="dummy_block"></div>\n' +
  '          <div class="key_result_progressbar">\n' +
  '            <div class="progressbar"></div>\n' +
  '            <div class="progress_percent">100%</div>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '      </div>';

const done_key_result_icon = '' +
  '<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  ' <path d="M1 3.18182L4.11111 7L9 1" stroke="#136AFB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
  '</svg>';


function generate_key_results_block(key_results, position_number) {

  let key_results_block = document.createElement('div');
  key_results_block.classList.add('key_result_block');
  // key_results_block.classList.add('active');

  for (let key_result of key_results) {
    let temp_node = document.createElement('div');
    temp_node.innerHTML = key_result_template;
    let key_result_element = temp_node.firstElementChild;

    key_result_element.querySelector('.key_result_text > .text').innerText = key_result.text;
    let progress = Math.round(key_result.progress * 100) + '%';
    key_result_element.querySelector('.progressbar').style.setProperty('--progress_variable', progress);
    key_result_element.querySelector('.progress_percent').innerText = progress;

    if (progress == '100%') {
      key_result_element.classList.add('done');
      key_result_element.querySelector('.key_result_icon').innerHTML = done_key_result_icon;
    }
    key_results_block.appendChild(key_result_element);
  }

  key_results_block.style.setProperty('grid-column-start', position_number);
  key_results_block.style.setProperty('grid-row-start', 2);

  key_results_block.dataset.position = position_number;

  return key_results_block;
}

function render_okr(wrapper_element, okr, position_number, department) {

  let okr_block;

  if (department == 'MAIN') {
    okr_block = document.createElement('div');
    okr_block.classList.add('okr_block');
    okr_block.innerHTML = okr_block_template;

    okr_block.querySelector('.objective_text').innerText = okr.text;
    let progress = Math.round(okr.progress * 100) + '%';
    okr_block.querySelector('.progress_percent').innerText = progress;
    okr_block.querySelector('.progressbar').style.setProperty('--progress_variable', progress);
    okr_block.style.setProperty('grid-column-start', position_number);
    okr_block.style.setProperty('grid-row-start', 1);

    okr_block.querySelector('.expand_toggle').dataset.position = position_number;

    wrapper_element.appendChild(generate_key_results_block(okr.key_results, position_number));
  } else {
    okr_block = generate_okr(okr);
  }

  wrapper_element.appendChild(okr_block);
}

function catch_toggle_click(wrapper_element) {
  let toggles = wrapper_element.getElementsByClassName('expand_toggle');

  for (let toggle of toggles) {
    toggle.addEventListener('click', function (event){
      let okr_block = event.target.closest('.okr_block');
      let current_element = event.target.closest('.expand_toggle');

      let position = current_element.dataset.position;
      let key_result_block = wrapper_element.querySelector(`.key_result_block[data-position='${position}']`);

      if (okr_block.classList.contains('active')) {
        okr_block.classList.remove('active');
        key_result_block.classList.remove('active');
      } else {
        okr_block.classList.add('active');
        key_result_block.classList.add('active');

      }

    });
  }
}

function render_data(data) {
  let wrappers = document.getElementsByClassName('okrs_wrapper');

  for (let wrapper of wrappers) {
      let department = wrapper.dataset.department;

      let position_number = 0;
      for (let okr of data[department]['objectives']) {
        position_number++;

        render_okr(wrapper, okr, position_number, department)

      }

      catch_toggle_click(wrapper);
      //for wiki, to not to cut the shadows
      let inner_cell_block = wrapper.closest('.innerCell');
      if (inner_cell_block) {
        inner_cell_block.style.setProperty('overflow-x', 'visible');
      }

  }

}


