import Chart from './chart';

import dataRange from '@src/store/dataRange';
import scale from '@src/store/scale';
import axes from '@src/store/axes';
import dataLabels from '@src/store/dataLabels';
import stackSeriesData from '@src/store/stackSeriesData';

import HoveredSeries from '@src/component/hoveredSeries';
import Tooltip from '@src/component/tooltip';
import Plot from '@src/component/plot';
import AreaSeries from '@src/component/areaSeries';
import Axis from '@src/component/axis';
import DataLabels from '@src/component/dataLabels';
import Title from '@src/component/title';
import AxisTitle from '@src/component/axisTitle';
import ExportMenu from '@src/component/exportMenu';
import Legend from '@src/component/legend';
import Zoom from '@src/component/zoom';

import * as lineSeriesBrush from '@src/brushes/lineSeries';
import * as basicBrush from '@src/brushes/basic';
import * as axisBrush from '@src/brushes/axis';
import * as legendBrush from '@src/brushes/legend';
import * as labelBrush from '@src/brushes/label';
import * as exportMenuBrush from '@src/brushes/exportMenu';
import * as dataLabelBrush from '@src/brushes/dataLabel';
import * as resetButtonBrush from '@src/brushes/resetButton';

import { AreaChartOptions, AreaSeriesData, AreaSeriesType } from '@t/options';

interface AreaChartProps {
  el: Element;
  options: AreaChartOptions;
  data: AreaSeriesData;
}

export default class AreaChart extends Chart<AreaChartOptions> {
  modules = [stackSeriesData, dataRange, scale, axes, dataLabels];

  constructor(props: AreaChartProps) {
    super({
      el: props.el,
      options: props.options,
      series: {
        area: props.data.series as AreaSeriesType[],
      },
      categories: props.data.categories,
    });
  }

  initialize() {
    super.initialize();

    this.componentManager.add(Title);
    this.componentManager.add(Plot);
    this.componentManager.add(Legend);
    this.componentManager.add(AreaSeries);
    this.componentManager.add(Axis, { name: 'xAxis' });
    this.componentManager.add(DataLabels);
    this.componentManager.add(HoveredSeries);
    this.componentManager.add(Axis, { name: 'yAxis' });
    this.componentManager.add(AxisTitle, { name: 'xAxis' });
    this.componentManager.add(AxisTitle, { name: 'yAxis' });
    this.componentManager.add(ExportMenu, { chartEl: this.el });
    this.componentManager.add(Tooltip, { chartEl: this.el });
    this.componentManager.add(Zoom);

    this.painter.addGroups([
      basicBrush,
      axisBrush,
      lineSeriesBrush,
      legendBrush,
      labelBrush,
      exportMenuBrush,
      dataLabelBrush,
      resetButtonBrush,
    ]);
  }
}