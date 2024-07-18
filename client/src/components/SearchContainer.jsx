import { FormRow, FormRowSelect } from '.';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { Form, useSubmit, Link } from 'react-router-dom';
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from '../utils/constants';
import { useAllJobsContext } from '../pages/AllJobs';

const SearchContainer = () => {
    const { searchValues } = useAllJobsContext();
    const { search = '', jobStatus = 'all', jobType = 'all', sort = 'newest' } = searchValues || {};

    const submit = useSubmit();

    const debounce = (onChange) => {
        let timeout;
        return (e) => {
            const form = e.currentTarget.form;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                onChange(form);
            }, 2000);
        };
    };

    return (
        <Wrapper>
            <Form className='form'>
                <h5 className='form-title'>Tìm kiếm</h5>
                <div className='form-center'>
                    {/* search position */}
                    <FormRow
                        type='search'
                        name='search'
                        defaultValue={search}
                        labelText='Nhập tìm Kiếm'
                        onChange={debounce((form) => {
                            submit(form);
                        })}
                    />
                    <FormRowSelect
                        labelText='Trạng Thái Công Việc'
                        name='jobStatus'
                        list={['all', ...Object.values(JOB_STATUS)]}
                        defaultValue={jobStatus}
                        onChange={(e) => {
                            submit(e.currentTarget.form);
                        }}
                    />
                    <FormRowSelect
                        labelText='Loại Công Việc'
                        name='jobType'
                        defaultValue={jobType}
                        list={['all', ...Object.values(JOB_TYPE)]}
                        onChange={(e) => {
                            submit(e.currentTarget.form);
                        }}
                    />
                    <FormRowSelect
                        labelText='Sắp xếp'
                        name='sort'
                        defaultValue={sort}
                        list={[...Object.values(JOB_SORT_BY)]}
                        onChange={(e) => {
                            submit(e.currentTarget.form);
                        }}
                    />
                    <Link to='/dashboard/all-jobs' className='btn form-btn delete-btn'>
                        Đặt lại giá trị
                    </Link>
                </div>
            </Form>
        </Wrapper>
    );
};

export default SearchContainer;
