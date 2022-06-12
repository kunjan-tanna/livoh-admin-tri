import { apiCall } from './util/common';

const options = [
    {
        value: 1,
        label: 'Audi',
    },
    {
        value: 2,
        label: 'Mercedes',
    },
    {
        value: 3,
        label: 'BMW',
    },
]

// for (let i = 0; i < 50; ++i) {
//   options.push({
//     value: i + 1,
//     label: `Option ${i + 1}`
//   });
// }

const sleep = ms =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });

const loadOptions = async (search, prevOptions) => {
    let res = await apiCall('POST', 'getCityList', { getAllCityListNames: "TRUE", page_no: 1, limit: 10 });
    await sleep(1000);

    let filteredOptions;
    if (!search) {
        filteredOptions = res.data;
    } else {
        const searchLower = search.toLowerCase();

        filteredOptions = options.filter(({ label }) =>
            label.toLowerCase().includes(searchLower)
        );
    }

    const hasMore = filteredOptions.length > prevOptions.length + 10;
    const slicedOptions = filteredOptions.slice(
        prevOptions.length,
        prevOptions.length + 10
    );

    return {
        options: slicedOptions,
        hasMore
    };
};

export default loadOptions;
