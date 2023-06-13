import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import TabItem from '../custom/TabItem';
import FirstPage from './contents/measure/FirstPage';
import SecondPage from './contents/measure/SecondPage';
import ThirdPage from './contents/measure/ThirdPage';
import FourthPage from './contents/measure/FourthPage';
import { connect } from 'react-redux';
// import FifthPage from "./contents/measure/FifthPage";

const mapStateToProps = (state) => ({
  showICTMethodDialog: state.measure.showICTMethodDialog,
});

const MeasureTab = (props) => {
  const [page, setPage] = useState(1);
  const [popupVisible, setPopupVisible] = useState(false);
  const handleChange = (event, value) => {
    if (popupVisible) return false;
    setPage(value);
  };

  useEffect(() => {
    setPopupVisible(props.showICTMethodDialog);
  }, [props]);
  return (
    <>
      <TabItem title="Measure">
        <div className="text-center">
          <Pagination
            count={3}
            page={page}
            onChange={handleChange}
            shape="rounded"
            size="small"
            sx={{
              '& .MuiPagination-ul': {
                display: 'flex',
                justifyContent: 'space-between',
                margin: '2px 0',
              },
            }}
          />
        </div>
        <Divider className="mb-2" />
        {page === 1 && <FirstPage />}
        {page === 2 && <SecondPage />}
        {page === 3 && <ThirdPage />}
        {/* {page === 4 && <FourthPage />} */}
        {/* {page === 5 && <FifthPage />} */}
      </TabItem>
    </>
  );
};

export default connect(mapStateToProps)(MeasureTab);
