sc.define("bilin", {
  Number: function(inCenter, inMin, inMax, outCenter, outMin, outMax, clip) {
    if (sc.isArrayArgs(arguments, 6)) {
      return [this,inCenter,inMin,inMax,outCenter,outMin,outMax].flop().map(function(items) {
        return items[0].bilin(items[1],items[2],items[3],items[4],items[5],items[6],clip);
      });
    }
    switch (clip) {
    case "min":
      if (this <= inMin) { return outMin; }
      break;
    case "max":
      if (this >= inMax) { return outMax; }
      break;
    case "minmax":
      /* falls through */
    default:
      if (this <= inMin) { return outMin; }
      if (this >= inMax) { return outMax; }
      break;
    }
    if (this >= inCenter) {
      return this.linlin(inCenter, inMax, outCenter, outMax);
    } else {
      return this.linlin(inMin, inCenter, outMin, outCenter);
    }
  },
  Array: function(inCenter, inMin, inMax, outCenter, outMin, outMax, clip) {
    return this.map(function(x) { return x.bilin(inCenter, inMin, inMax, outCenter, outMin, outMax, clip); });
  }
});
