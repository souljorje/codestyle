import $ from 'jquery';

class Fixator {
  constructor(options) {
    this.appended = false;
    this.options = {
      wrapper: options.wrapper || '',
      table: options.table || '',
      row: options.row || '',
    };

    this.$wrapper = $(this.options.wrapper);
    this.$table = $(this.options.table);
    this.$row = $(this.options.row);
    this.$clone = this.$row.clone().addClass('_cloned');

    this.$fixWrap = $('<div/>', { class: 'table-fix' });
    this.$fixTable = $('<table/>', {}).appendTo(this.$fixWrap);
    this.$fixTbody = $('<tbody/>', {}).appendTo(this.$fixTable);

    this.render = this.render.bind(this);
    this.update = this.update.bind(this);
    this.changePosition = this.changePosition.bind(this);
  }

  init() {
    this.$wrapper.append(this.$fixWrap);

    this.$fixWrap.width(this.coords.wrapper.width);
    this.$fixTable.width(this.coords.table.width);

    $(window).on('scroll', this.render);
    $(window).on('resize', this.update);
    this.$wrapper.on('scroll', this.changePosition);
  }

  update() {
    this.$wrapper = $(this.options.wrapper);
    this.$table = $(this.options.table);
    this.$row = $(this.options.row);
    this.$clone.html(this.$row.html());

    this.$fixWrap.width(this.coords.wrapper.width);
    this.$fixTable.width(this.coords.table.width);
  }

  render() {
    if (this.coords.window.scrollTop > this.coords.row.offset &&
            this.coords.row.offset !== 0 &&
            this.coords.window.scrollTop <
            (this.coords.wrapper.offset +
            this.coords.wrapper.height) -
            (this.coords.clone.height + 120)) {
      if (!this.appended) {
        this.$fixTbody.append(this.$clone);
        this.appended = true;
      }
    } else {
      this.$clone.detach();
      this.appended = false;
    }
  }

  changePosition() {
    this.$fixTable.css('margin-left', -this.coords.wrapper.scrollLeft);
  }

  get coords() {
    return {
      wrapper: {
        height: this.$wrapper.height(),
        width: this.$wrapper.width(),
        offset: this.$wrapper.offset().top,
        scrollLeft: this.$wrapper.scrollLeft(),
      },
      table: {
        width: this.$table.width(),
      },
      row: {
        position: this.$row.position().top,
        offset: this.$row.offset().top,
      },
      window: {
        scrollTop: $(window).scrollTop(),
      },
      clone: {
        height: this.$clone.height(),
      },
    };
  }
}

class GrabAndSlide {
  constructor(selector) {
    this.selector = selector;
    this.mousePosition = null;
    this.scrollPosition = null;
    this.scroll = null;
    this.start = this.start.bind(this);
    this.scroll = this.onScroll.bind(this);
    this.end = this.end.bind(this);
  }

  init() {
    $(this.selector).on('mousedown', e => this.start(e));
    $(this.selector).on('mousemove', e => this.onScroll(e));
    $(this.selector).on('mouseup mouseleave', this.end);
  }

  start(e) {
    this.mousePosition = e.pageX;
    this.scrollPosition = $(this.selector).scrollLeft();
    this.scroll = true;
  }

  onScroll(e) {
    if (this.scroll === true) {
      e.preventDefault();

      if (e.pageX > this.mousePosition) {
        $(this.selector).scrollLeft(this.scrollPosition - (e.pageX - this.mousePosition));
      } else if (e.pageX < this.mousePosition) {
        $(this.selector).scrollLeft(this.scrollPosition + (this.mousePosition - e.pageX));
      }
    }
  }

  end() {
    this.scroll = false;
  }
}

const fixator = new Fixator({
  wrapper: '.table-wrap',
  table: '.table',
  row: '.table .label',
});
const sliderForTable = new GrabAndSlide('.table-wrap');

fixator.init();
sliderForTable.init();
