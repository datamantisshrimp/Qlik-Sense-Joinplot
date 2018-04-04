# Qlik Sense Joinplot 

This chart is a port into Qlik Sense using d3 of the Seaborn library joinplot for python (https://seaborn.pydata.org/generated/seaborn.jointplot.html)

The chart represents a scatter plot with the corresponding frequency distributions on two histograms.

## Usage:
- Add two dimensions that contain numerical values to plot the chart
- Add a third optional dimension to classify the dots (the legend will be available on the top right) 
- Do not edit or delete the default measure "=Count(1)", this is used to properly show all the instances of the data

## Features:
- Tooltips (dots, histogram bars, regression line)
- Regression line
- Legend (only using 3 dimensions)
- Dots selection (only using 3 dimensions)
- Dots size
- Dots opacity
- Grid
- Histograms custom colours
- Number of histograms bins (equal to ticks, custom, applying Freedman-Diaconis or Sturger Formula)


###Author
Marco @MantisShrimp
datamantisshrimp@gmail.com

![Alt text](screenshots/logo.png?raw=true "MantisShrimp")