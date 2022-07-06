// @ts-nocheck
const flatten = (ob: object): object => {
    const result = {};
    for (const i in ob) {
        if (typeof ob[i] === 'object' && !Array.isArray(ob[i])) {
            if (ob[i].hasOwnProperty('Value')) {
                if (i + '_value' === 'Image_value') {
                    const isArray = Array.isArray(ob[i]['Value']);

                    result[i + '_value'] = isArray ? ob[i]['Value'][0] : ob[i]['Value'];
                } else {
                    result[i + '_value'] = ob[i]['Value'];
                }
            }
            if (ob[i].hasOwnProperty('Description')) {
                result[i + '_Description'] = ob[i]['Description'];
            }
            if (ob[i].hasOwnProperty('ItemCode')) {
                const isArray = Array.isArray(ob[i]['ItemCode']);
                result[i + '_ItemCode'] = isArray
                    ? ob[i]['ItemCode'].map((e) => `id:${e}`).join(', ')
                    : ob[i]['ItemCode'];
            }
            // if (ob[i].hasOwnProperty("FeatureETIM")) {
            //   const _tempObj = {};

            //   ob[i]["FeatureETIM"].forEach((el) => {
            //     _tempObj[el.FeatureName] =
            //       `${el.FeatureValue} ${el.FeatureUom}`.trim();
            //   });

            //   result = { ...result, ..._tempObj };
            // }
            const temp = flatten(ob[i]);
            for (const j in temp) {
                result[j] = temp[j];
            }
        } else {
            result[i] = ob[i];
        }
    }
    return result;
};

export default flatten;
